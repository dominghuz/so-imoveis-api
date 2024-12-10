import Agendamento from '../models/Agendamento.js';
import Imovel from '../models/Imovel.js';
import Usuario from '../models/Usuario.js';

export const listarAgendamentos = async (req, res, next) => {
  try {
    const { 
      data,
      status,
      corretor_id,
      cliente_id,
      imovel_id,
      page = 1,
      limit = 10
    } = req.query;

    console.log('Filtros recebidos:', { data, status, corretor_id, cliente_id, imovel_id });

    const filtros = {
      data,
      status,
      imovel_id,
      limit: parseInt(limit),
      offset: (page - 1) * limit
    };

    // Restringe visualização baseado no tipo de usuário
    if (req.userTipo === 'corretor') {
      filtros.corretor_id = req.userId;
    } else if (req.userTipo === 'cliente') {
      filtros.cliente_id = req.userId;
    }

    console.log('Filtros aplicados:', filtros);

    const agendamentos = await Agendamento.listar(filtros);
    const total = await Agendamento.contar(filtros);

    // Log para debug
    console.log('Total de agendamentos:', total);
    console.log('Primeiro agendamento:', agendamentos[0]);

    res.json({
      dados: agendamentos,
      paginacao: {
        total,
        pagina_atual: parseInt(page),
        total_paginas: Math.ceil(total / limit),
        itens_por_pagina: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Erro ao listar agendamentos:', error);
    next(error);
  }
};

export const buscarAgendamento = async (req, res, next) => {
  try {
    const agendamento = await Agendamento.buscarPorId(req.params.id);
    
    if (!agendamento) {
      return res.status(404).json({ erro: 'Agendamento não encontrado' });
    }

    // Verifica permissão
    if (req.userTipo !== 'admin' && 
        req.userId !== agendamento.cliente_id && 
        req.userId !== agendamento.corretor_id) {
      return res.status(403).json({ erro: 'Sem permissão para ver este agendamento' });
    }
    
    res.json(agendamento);
  } catch (error) {
    next(error);
  }
};

export const criarAgendamento = async (req, res, next) => {
  try {
    const { imovel_id, corretor_id, data, hora, observacoes } = req.body;

    // Validações básicas
    if (!imovel_id || !corretor_id || !data || !hora) {
      return res.status(400).json({ 
        erro: 'Todos os campos obrigatórios devem ser fornecidos' 
      });
    }

    // Verifica se o imóvel existe e está disponível
    const imovel = await Imovel.buscarPorId(imovel_id);
    if (!imovel) {
      return res.status(404).json({ erro: 'Imóvel não encontrado' });
    }
    if (imovel.status !== 'disponivel') {
      return res.status(400).json({ erro: 'Imóvel não está disponível' });
    }

    // Verifica se o corretor existe
    const corretor = await Usuario.buscarPorId(corretor_id);
    if (!corretor || corretor.tipo !== 'corretor') {
      return res.status(404).json({ erro: 'Corretor não encontrado' });
    }

    // Verifica disponibilidade do horário
    const disponivel = await Agendamento.verificarDisponibilidade(data, hora, corretor_id);
    if (!disponivel) {
      return res.status(400).json({ erro: 'Horário não disponível para este corretor' });
    }

    // Cria o agendamento
    const agendamento = await Agendamento.criar({
      imovel_id,
      cliente_id: req.userId,
      corretor_id,
      data,
      hora,
      observacoes,
      status: 'pendente'
    });

    res.status(201).json(agendamento);
  } catch (error) {
    next(error);
  }
};

export const atualizarAgendamento = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, observacoes } = req.body;
    
    const agendamento = await Agendamento.buscarPorId(id);
    if (!agendamento) {
      return res.status(404).json({ erro: 'Agendamento não encontrado' });
    }

    // Verifica permissões
    if (req.userTipo !== 'admin' && req.userId !== agendamento.corretor_id) {
      return res.status(403).json({ erro: 'Sem permissão para atualizar este agendamento' });
    }

    // Valida o status
    const statusValidos = ['pendente', 'confirmado', 'cancelado', 'realizado'];
    if (status && !statusValidos.includes(status)) {
      return res.status(400).json({ erro: 'Status inválido' });
    }

    const agendamentoAtualizado = await Agendamento.atualizar(id, {
      status,
      observacoes,
      updated_at: new Date()
    });

    res.json(agendamentoAtualizado);
  } catch (error) {
    next(error);
  }
};

export const deletarAgendamento = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const agendamento = await Agendamento.buscarPorId(id);
    if (!agendamento) {
      return res.status(404).json({ erro: 'Agendamento não encontrado' });
    }

    // Apenas admin pode deletar
    if (req.userTipo !== 'admin') {
      return res.status(403).json({ erro: 'Sem permissão para deletar agendamentos' });
    }

    await Agendamento.deletar(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const listarAgendamentosPorPeriodo = async (req, res, next) => {
  try {
    const { data_inicio, data_fim } = req.query;

    // Validação das datas
    if (!data_inicio || !data_fim) {
      return res.status(400).json({ erro: 'Data inicial e final são obrigatórias' });
    }

    const corretor_id = req.userTipo === 'corretor' ? req.userId : null;

    const agendamentos = await Agendamento.listarPorPeriodo(
      data_inicio,
      data_fim,
      corretor_id
    );

    res.json(agendamentos);
  } catch (error) {
    next(error);
  }
}; 
