import supabase from '../config/supabase.js';
import { ClienteSchema } from '../models/Cliente.js';

export const getClientes = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, tipo, search } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('clientes')
      .select('*', { count: 'exact' })
      .range(offset, offset + limit - 1)
      .order('nome');

    if (tipo) {
      query = query.eq('tipo', tipo);
    }

    if (search) {
      query = query.or(`nome.ilike.%${search}%,email.ilike.%${search}%,telefone.ilike.%${search}%`);
    }

    const { data, error, count } = await query;

    if (error) throw error;

    res.json({
      clientes: data,
      pagination: {
        total: count,
        page: parseInt(page),
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getCliente = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('clientes')
      .select(`
        *,
        agendamentos:agendamentos(*)
      `)
      .eq('id', req.params.id)
      .single();

    if (error) throw error;
    if (!data) {
      const error = new Error('Cliente não encontrado');
      error.status = 404;
      throw error;
    }
    
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const createCliente = async (req, res, next) => {
  try {
    const validatedData = await ClienteSchema.parseAsync(req.body);

    const { data, error } = await supabase
      .from('clientes')
      .insert([{
        ...validatedData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

export const updateCliente = async (req, res, next) => {
  try {
    const validatedData = await ClienteSchema.partial().parseAsync(req.body);

    const { data, error } = await supabase
      .from('clientes')
      .update({
        ...validatedData,
        updated_at: new Date().toISOString()
      })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) {
      const error = new Error('Cliente não encontrado');
      error.status = 404;
      throw error;
    }
    
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const deleteCliente = async (req, res, next) => {
  try {
    const { error } = await supabase
      .from('clientes')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ message: 'Cliente removido com sucesso' });
  } catch (error) {
    next(error);
  }
}; 