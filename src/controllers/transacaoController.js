import supabase from '../config/supabase.js';
import { TransacaoSchema } from '../models/Transacao.js';

export const getTransacoes = async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      tipo,
      status,
      data_inicio,
      data_fim,
      corretor_id 
    } = req.query;
    
    const offset = (page - 1) * limit;

    let query = supabase
      .from('transacoes')
      .select(`
        *,
        imovel:imovel_id(*),
        cliente:cliente_id(*),
        corretor:corretor_id(*)
      `, { count: 'exact' })
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    if (tipo) {
      query = query.eq('tipo', tipo);
    }

    if (status) {
      query = query.eq('status', status);
    }

    if (data_inicio) {
      query = query.gte('data_inicio', data_inicio);
    }

    if (data_fim) {
      query = query.lte('data_fim', data_fim);
    }

    if (corretor_id) {
      query = query.eq('corretor_id', corretor_id);
    }

    const { data, error, count } = await query;

    if (error) throw error;

    res.json({
      transacoes: data,
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

export const getTransacao = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('transacoes')
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
      const error = new Error('Transação não encontrada');
      error.status = 404;
      throw error;
    }
    
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const createTransacao = async (req, res, next) => {
  try {
    const validatedData = await TransacaoSchema.parseAsync(req.body);

    const { data, error } = await supabase
      .from('transacoes')
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

export const updateTransacao = async (req, res, next) => {
  try {
    const validatedData = await TransacaoSchema.partial().parseAsync(req.body);

    const { data, error } = await supabase
      .from('transacoes')
      .update({
        ...validatedData,
        updated_at: new Date().toISOString()
      })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) {
      const error = new Error('Transação não encontrada');
      error.status = 404;
      throw error;
    }
    
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const deleteTransacao = async (req, res, next) => {
  try {
    const { error } = await supabase
      .from('transacoes')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ message: 'Transação removida com sucesso' });
  } catch (error) {
    next(error);
  }
};

export const getBalanco = async (req, res, next) => {
  try {
    const { data_inicio, data_fim } = req.query;
    
    let query = supabase
      .from('transacoes')
      .select('tipo, valor');

    if (data_inicio) {
      query = query.gte('data_inicio', data_inicio);
    }

    if (data_fim) {
      query = query.lte('data_fim', data_fim);
    }

    const { data, error } = await query;

    if (error) throw error;

    const balanco = data.reduce((acc, curr) => {
      const valor = parseFloat(curr.valor);
      return curr.tipo === 'venda' ? acc + valor : acc - valor;
    }, 0);

    res.json({ balanco });
  } catch (error) {
    next(error);
  }
};

export const getRelatorioTransacoes = async (req, res, next) => {
  try {
    const { data_inicio, data_fim } = req.query;
    
    let query = supabase
      .from('transacoes')
      .select(`
        *,
        imovel:imovel_id(*),
        cliente:cliente_id(*),
        corretor:corretor_id(*)
      `)
      .order('data_inicio', { ascending: false });

    if (data_inicio) {
      query = query.gte('data_inicio', data_inicio);
    }

    if (data_fim) {
      query = query.lte('data_fim', data_fim);
    }

    const { data, error } = await query;

    if (error) throw error;

    const relatorio = {
      total_transacoes: data.length,
      total_vendas: data.filter(t => t.tipo === 'venda').length,
      total_alugueis: data.filter(t => t.tipo === 'aluguel').length,
      valor_total: data.reduce((acc, curr) => acc + parseFloat(curr.valor), 0),
      transacoes: data
    };

    res.json(relatorio);
  } catch (error) {
    next(error);
  }
}; 