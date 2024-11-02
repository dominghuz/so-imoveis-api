import supabase from '../config/supabase.js';
import { UsuarioSchema, UsuarioUpdateSchema } from '../models/Usuario.js';

export const getUsuarios = async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      tipo,
      search 
    } = req.query;
    
    const offset = (page - 1) * limit;

    let query = supabase
      .from('usuarios')
      .select('*', { count: 'exact' })
      .range(offset, offset + limit - 1)
      .order('nome');

    if (tipo) {
      query = query.eq('tipo', tipo);
    }

    if (search) {
      query = query.or(`nome.ilike.%${search}%,email.ilike.%${search}%`);
    }

    const { data, error, count } = await query;

    if (error) throw error;

    res.json({
      usuarios: data,
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

export const getUsuario = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;
    if (!data) {
      const error = new Error('Usuário não encontrado');
      error.status = 404;
      throw error;
    }
    
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const createUsuario = async (req, res, next) => {
  try {
    const validatedData = await UsuarioSchema.parseAsync(req.body);

    // Criar usuário no auth do Supabase
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: validatedData.email,
      password: validatedData.senha
    });

    if (authError) throw authError;

    // Criar registro na tabela usuarios
    const { data, error } = await supabase
      .from('usuarios')
      .insert([{
        id: authData.user.id, // Usar o mesmo ID gerado pelo auth
        email: validatedData.email,
        nome: validatedData.nome,
        telefone: validatedData.telefone,
        tipo: validatedData.tipo,
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

export const updateUsuario = async (req, res, next) => {
  try {
    const validatedData = await UsuarioUpdateSchema.parseAsync(req.body);

    const { data, error } = await supabase
      .from('usuarios')
      .update({
        ...validatedData,
        updated_at: new Date().toISOString()
      })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) {
      const error = new Error('Usuário não encontrado');
      error.status = 404;
      throw error;
    }
    
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const deleteUsuario = async (req, res, next) => {
  try {
    // Primeiro deletar o usuário do auth
    const { error: authError } = await supabase.auth.admin.deleteUser(
      req.params.id
    );

    if (authError) throw authError;

    // Depois deletar da tabela usuarios
    const { error } = await supabase
      .from('usuarios')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ message: 'Usuário removido com sucesso' });
  } catch (error) {
    next(error);
  }
};

// Endpoints adicionais para corretores
export const getCorretores = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('tipo', 'corretor')
      .order('nome');

    if (error) throw error;
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const updateSenha = async (req, res, next) => {
  try {
    const { senha_atual, nova_senha } = req.body;

    const { error } = await supabase.auth.updateUser({
      password: nova_senha
    });

    if (error) throw error;
    res.json({ message: 'Senha atualizada com sucesso' });
  } catch (error) {
    next(error);
  }
}; 