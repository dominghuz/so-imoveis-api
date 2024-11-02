import supabase from '../config/supabase.js';
import { AgendamentoSchema } from '../models/Agendamento.js';

export const getAgendamentos = async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status,
      data_inicio,
      data_fim,
      corretor_id 
    } = req.query;
    
    const offset = (page - 1) * limit;

    let query = supabase
      .from('agendamentos')
      .select(`
        *,
        imovel:imovel_id(*),
        cliente:cliente_id(*),
        corretor:corretor_id(*)
      `, { count: 'exact' })
      .range(offset, offset + limit - 1)
      .order('data_hora', { ascending: true });

    if (status) {
      query = query.eq('status', status);
    }

    if (data_inicio) {
      query = query.gte('data_hora', data_inicio);
    }

    if (data_fim) {
      query = query.lte('data_hora', data_fim);
    }

    if (corretor_id) {
      query = query.eq('corretor_id', corretor_id);
    }

    const { data, error, count } = await query;

    if (error) throw error;

    res.json({
      agendamentos: data,
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

export const getAgendamento = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('agendamentos')
      .select(`
        *,
        imovel:imovel_id(*),
        cliente:cliente_id(*),
        corretor:corretor_id(*)
      `)
      .eq('id', req.params.id)
      .single();

    if (error) throw error;
    if (!data) {
      const error = new Error('Agendamento não encontrado');
      error.status = 404;
      throw error;
    }
    
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const createAgendamento = async (req, res, next) => {
  try {
    const validatedData = await AgendamentoSchema.parseAsync(req.body);

    // Verificar disponibilidade do horário
    const { data: conflito } = await supabase
      .from('agendamentos')
      .select('id')
      .eq('imovel_id', validatedData.imovel_id)
      .eq('data_hora', validatedData.data_hora)
      .eq('status', 'AGENDADO')
      .single();

    if (conflito) {
      const error = new Error('Horário já agendado para este imóvel');
      error.status = 400;
      throw error;
    }

    const { data, error } = await supabase
      .from('agendamentos')
      .insert([{
        ...validatedData,
        corretor_id: req.user?.id,
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

export const updateAgendamento = async (req, res, next) => {
  try {
    const validatedData = await AgendamentoSchema.partial().parseAsync(req.body);

    const { data, error } = await supabase
      .from('agendamentos')
      .update({
        ...validatedData,
        updated_at: new Date().toISOString()
      })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) {
      const error = new Error('Agendamento não encontrado');
      error.status = 404;
      throw error;
    }
    
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const cancelarAgendamento = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('agendamentos')
      .update({
        status: 'CANCELADO',
        updated_at: new Date().toISOString()
      })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) {
      const error = new Error('Agendamento não encontrado');
      error.status = 404;
      throw error;
    }
    
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const getAgendamentosByImovel = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('agendamentos')
      .select(`
        *,
        cliente:cliente_id(*),
        corretor:corretor_id(*)
      `)
      .eq('imovel_id', req.params.id)
      .order('data_hora', { ascending: true });

    if (error) throw error;
    
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const getAgendamentosByCorretor = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('agendamentos')
      .select(`
        *,
        imovel:imovel_id(*),
        cliente:cliente_id(*)
      `)
      .eq('corretor_id', req.params.id)
      .order('data_hora', { ascending: true });

    if (error) throw error;
    
    res.json(data);
  } catch (error) {
    next(error);
  }
}; 