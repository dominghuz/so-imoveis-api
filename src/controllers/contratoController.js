import Contrato from '../models/Contrato.js';
import Imovel from '../models/Imovel.js';

export const getContratos = async (req, res, next) => {
  try {
    const { 
      tipo,
      status,
      corretor_id,
      cliente_id,
      page = 1,
      limit = 10
    } = req.query;

    const filtros = {
      tipo,
      status,
      limit: parseInt(limit),
      offset: (page - 1) * limit
    };

    // Restringe visualização baseado no tipo de usuário
    if (req.userTipo === 'corretor') {
      filtros.corretor_id = req.userId;
    }

    const contratos = await Contrato.listar(filtros);
    const total = await Contrato.contar(filtros);

    res.json({
      dados: contratos,
      paginacao: {
        total,
        pagina_atual: parseInt(page),
        total_paginas: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getContrato = async (req, res, next) => {
  try {
    const contrato = await Contrato.buscarPorId(req.params.id);
    
    if (!contrato) {
      return res.status(404).json({ erro: 'Contrato não encontrado' });
    }
    
    res.json(contrato);
  } catch (error) {
    next(error);
  }
};

export const createContrato = async (req, res, next) => {
  try {
    const {
      imovel_id,
      cliente_id,
      tipo,
      valor,
      data_inicio,
      data_fim,
      observacoes
    } = req.body;

    // Validações básicas
    if (!imovel_id || !cliente_id || !tipo || !valor || !data_inicio) {
      return res.status(400).json({ 
        erro: 'Dados incompletos',
        camposNecessarios: ['imovel_id', 'cliente_id', 'tipo', 'valor', 'data_inicio']
      });
    }

    // Verificar se o imóvel existe e está disponível
    const imovel = await Imovel.buscarPorId(imovel_id);
    if (!imovel) {
      return res.status(404).json({ erro: 'Imóvel não encontrado' });
    }

    if (imovel.status !== 'disponivel') {
      return res.status(400).json({ erro: 'Imóvel não está disponível' });
    }

    // Criar contrato
    const contrato = await Contrato.criar({
      imovel_id,
      cliente_id,
      corretor_id: req.userId, // ID do corretor logado
      tipo,
      valor,
      data_inicio,
      data_fim,
      observacoes,
      status: 'pendente'
    });

    // Atualizar status do imóvel
    await Imovel.atualizar(imovel_id, {
      status: tipo === 'venda' ? 'vendido' : 'alugado'
    });

    res.status(201).json(contrato);
  } catch (error) {
    next(error);
  }
};

export const updateContrato = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, observacoes } = req.body;

    const contrato = await Contrato.buscarPorId(id);
    if (!contrato) {
      return res.status(404).json({ erro: 'Contrato não encontrado' });
    }

    // Validar status
    const statusValidos = ['pendente', 'assinado', 'cancelado', 'finalizado'];
    if (status && !statusValidos.includes(status)) {
      return res.status(400).json({ 
        erro: 'Status inválido',
        statusValidos
      });
    }

    const contratoAtualizado = await Contrato.atualizar(id, {
      status,
      observacoes,
      updated_at: new Date()
    });

    res.json(contratoAtualizado);
  } catch (error) {
    next(error);
  }
};

export const deleteContrato = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const contrato = await Contrato.buscarPorId(id);
    if (!contrato) {
      return res.status(404).json({ erro: 'Contrato não encontrado' });
    }

    // Restaurar status do imóvel para disponível
    await Imovel.atualizar(contrato.imovel_id, { status: 'disponivel' });

    await Contrato.deletar(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const gerarPDF = async (req, res, next) => {
  try {
    const contrato = await Contrato.buscarPorId(req.params.id);
    
    if (!contrato) {
      return res.status(404).json({ erro: 'Contrato não encontrado' });
    }

    // TODO: Implementar geração de PDF
    res.json({
      message: 'Função de geração de PDF será implementada',
      contrato
    });
  } catch (error) {
    next(error);
  }
}; 