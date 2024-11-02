import supabase from '../config/supabase.js';
import { ContratoSchema } from '../models/Contrato.js';

export const getContratos = async (req, res, next) => {
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
      .from('contratos')
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
      contratos: data,
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

export const getContrato = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('contratos')
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
      const error = new Error('Contrato não encontrado');
      error.status = 404;
      throw error;
    }
    
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const createContrato = async (req, res, next) => {
  try {
    const validatedData = await ContratoSchema.parseAsync(req.body);

    // Verificar se o imóvel está disponível
    const { data: imovel, error: imovelError } = await supabase
      .from('imoveis')
      .select('status')
      .eq('id', validatedData.imovel_id)
      .single();

    if (imovelError || !imovel) {
      const error = new Error('Imóvel não encontrado');
      error.status = 404;
      throw error;
    }

    if (imovel.status !== 'disponivel') {
      const error = new Error('Imóvel não está disponível');
      error.status = 400;
      throw error;
    }

    const { data, error } = await supabase
      .from('contratos')
      .insert([{
        ...validatedData,
        corretor_id: req.user?.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;

    // Atualizar status do imóvel
    await supabase
      .from('imoveis')
      .update({ 
        status: validatedData.tipo === 'venda' ? 'vendido' : 'alugado',
        updated_at: new Date().toISOString()
      })
      .eq('id', validatedData.imovel_id);

    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

export const updateContrato = async (req, res, next) => {
  try {
    const validatedData = await ContratoSchema.partial().parseAsync(req.body);

    const { data, error } = await supabase
      .from('contratos')
      .update({
        ...validatedData,
        updated_at: new Date().toISOString()
      })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) {
      const error = new Error('Contrato não encontrado');
      error.status = 404;
      throw error;
    }
    
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const deleteContrato = async (req, res, next) => {
  try {
    // Primeiro obter o contrato para saber o imóvel
    const { data: contrato, error: contratoError } = await supabase
      .from('contratos')
      .select('imovel_id')
      .eq('id', req.params.id)
      .single();

    if (contratoError || !contrato) {
      const error = new Error('Contrato não encontrado');
      error.status = 404;
      throw error;
    }

    // Deletar o contrato
    const { error } = await supabase
      .from('contratos')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;

    // Restaurar status do imóvel para disponível
    await supabase
      .from('imoveis')
      .update({ 
        status: 'disponivel',
        updated_at: new Date().toISOString()
      })
      .eq('id', contrato.imovel_id);

    res.json({ message: 'Contrato removido com sucesso' });
  } catch (error) {
    next(error);
  }
};

export const gerarPDF = async (req, res, next) => {
  try {
    const { data: contrato, error } = await supabase
      .from('contratos')
      .select(`
        *,
        imovel:imovel_id(*),
        cliente:cliente_id(*),
        corretor:corretor_id(*)
      `)
      .eq('id', req.params.id)
      .single();

    if (error || !contrato) {
      const error = new Error('Contrato não encontrado');
      error.status = 404;
      throw error;
    }

    // Aqui você implementaria a lógica de geração do PDF
    // Por exemplo, usando uma biblioteca como PDFKit ou html-pdf
    
    res.json({
      message: 'Função de geração de PDF será implementada',
      contrato
    });
  } catch (error) {
    next(error);
  }
}; 