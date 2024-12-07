import knex from '../database/connection.js';

export const getDashboardStats = async (req, res) => {
  try {
    // Estatísticas de Imóveis
    const imoveis = await knex('imoveis')
      .select('id', 'status', 'tipo', 'finalidade');

    // Estatísticas de Transações
    const transacoes = await knex('transacoes')
      .select('*');

    // Estatísticas de Agendamentos
    const agendamentos = await knex('agendamentos')
      .select('*');

    const stats = {
      imoveis: {
        total: imoveis.length,
        disponiveis: imoveis.filter(i => i.status === 'disponivel').length,
        vendidos: imoveis.filter(i => i.status === 'vendido').length,
        alugados: imoveis.filter(i => i.status === 'alugado').length,
        por_tipo: imoveis.reduce((acc, curr) => {
          acc[curr.tipo] = (acc[curr.tipo] || 0) + 1;
          return acc;
        }, {})
      },
      transacoes: {
        total: transacoes.length,
        vendas: transacoes.filter(t => t.tipo === 'venda').length,
        alugueis: transacoes.filter(t => t.tipo === 'aluguel').length,
        valor_total: transacoes.reduce((acc, curr) => acc + Number(curr.valor), 0)
      },
      agendamentos: {
        total: agendamentos.length,
        pendentes: agendamentos.filter(a => a.status === 'pendente').length,
        realizados: agendamentos.filter(a => a.status === 'realizado').length,
        cancelados: agendamentos.filter(a => a.status === 'cancelado').length
      }
    };

    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getComissoesPorCorretor = async (req, res) => {
  try {
    const { data_inicio, data_fim } = req.query;
    
    let query = knex('transacoes')
      .select(
        'transacoes.*',
        'usuarios.nome as corretor_nome',
        'usuarios.email as corretor_email'
      )
      .join('usuarios', 'transacoes.corretor_id', 'usuarios.id')
      .where('usuarios.tipo', 'corretor');

    if (data_inicio) {
      query.where('transacoes.data_inicio', '>=', data_inicio);
    }
    if (data_fim) {
      query.where('transacoes.data_inicio', '<=', data_fim);
    }

    const transacoes = await query;

    const comissoes = transacoes.reduce((acc, trans) => {
      if (!acc[trans.corretor_id]) {
        acc[trans.corretor_id] = {
          corretor_id: trans.corretor_id,
          corretor_nome: trans.corretor_nome,
          corretor_email: trans.corretor_email,
          total_transacoes: 0,
          valor_total: 0,
          comissao_total: 0
        };
      }
      
      acc[trans.corretor_id].total_transacoes++;
      acc[trans.corretor_id].valor_total += Number(trans.valor);
      
      // Comissão: 5% para vendas, 10% para aluguéis
      const comissao = trans.tipo === 'venda' 
        ? Number(trans.valor) * 0.05 
        : Number(trans.valor) * 0.10;
      
      acc[trans.corretor_id].comissao_total += comissao;
      
      return acc;
    }, {});

    res.json({ 
      success: true, 
      data: Object.values(comissoes) 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getConversaoPorCorretor = async (req, res) => {
  try {
    // Buscar agendamentos por corretor
    const agendamentos = await knex('agendamentos')
      .select(
        'agendamentos.*',
        'usuarios.nome as corretor_nome'
      )
      .join('usuarios', 'agendamentos.corretor_id', 'usuarios.id')
      .where('usuarios.tipo', 'corretor');

    // Buscar transações concluídas por corretor
    const transacoes = await knex('transacoes')
      .select('corretor_id')
      .where('status', 'concluido');

    const conversao = agendamentos.reduce((acc, agend) => {
      if (!acc[agend.corretor_id]) {
        acc[agend.corretor_id] = {
          corretor_id: agend.corretor_id,
          corretor_nome: agend.corretor_nome,
          total_visitas: 0,
          visitas_realizadas: 0,
          vendas_alugueis: 0,
          taxa_conversao: 0
        };
      }

      acc[agend.corretor_id].total_visitas++;
      if (agend.status === 'realizado') {
        acc[agend.corretor_id].visitas_realizadas++;
      }

      return acc;
    }, {});

    // Adicionar transações concluídas
    transacoes.forEach(trans => {
      if (conversao[trans.corretor_id]) {
        conversao[trans.corretor_id].vendas_alugueis++;
      }
    });

    // Calcular taxa de conversão
    Object.values(conversao).forEach(c => {
      c.taxa_conversao = c.visitas_realizadas > 0 
        ? (c.vendas_alugueis / c.visitas_realizadas) * 100 
        : 0;
    });

    res.json({ 
      success: true, 
      data: Object.values(conversao) 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getVendasPorPeriodo = async (req, res, next) => {
  try {
    const { data_inicio, data_fim } = req.query;
    
    let query = knex('transacoes')
      .select('*')
      .where('tipo', 'venda');

    if (data_inicio) {
      query.where('data_inicio', '>=', data_inicio);
    }
    if (data_fim) {
      query.where('data_fim', '<=', data_fim);
    }

    const data = await query;
    if (data.error) throw data.error;

    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const getLocacoesPorPeriodo = async (req, res, next) => {
  try {
    const { data_inicio, data_fim } = req.query;
    
    let query = knex('transacoes')
      .select('*')
      .where('tipo', 'aluguel');

    if (data_inicio) {
      query.where('data_inicio', '>=', data_inicio);
    }
    if (data_fim) {
      query.where('data_fim', '<=', data_fim);
    }

    const data = await query;
    if (data.error) throw data.error;

    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const getImoveisPorTipo = async (req, res, next) => {
  try {
    const { data, error } = await knex('imoveis')
      .select('tipo, status')
      .orderBy('tipo');

    if (error) throw error;

    const stats = data.reduce((acc, curr) => {
      if (!acc[curr.tipo]) {
        acc[curr.tipo] = { total: 0, disponiveis: 0, vendidos: 0, alugados: 0 };
      }
      acc[curr.tipo].total++;
      acc[curr.tipo][curr.status]++;
      return acc;
    }, {});

    res.json(stats);
  } catch (error) {
    next(error);
  }
};

export const getImoveisPorStatus = async (req, res, next) => {
  try {
    const { data, error } = await knex('imoveis')
      .select('status, tipo')
      .orderBy('status');

    if (error) throw error;

    const stats = data.reduce((acc, curr) => {
      if (!acc[curr.status]) {
        acc[curr.status] = { total: 0, tipos: {} };
      }
      acc[curr.status].total++;
      acc[curr.status].tipos[curr.tipo] = (acc[curr.status].tipos[curr.tipo] || 0) + 1;
      return acc;
    }, {});

    res.json(stats);
  } catch (error) {
    next(error);
  }
};

export const getTransacoesPorPeriodo = async (req, res, next) => {
  try {
    const { data_inicio, data_fim } = req.query;
    
    let query = knex('transacoes')
      .select(`
        *,
        imovel:imovel_id(*),
        cliente:cliente_id(*),
        corretor:corretor_id(*)
      `)
      .orderBy('data_inicio');

    if (data_inicio) {
      query.where('data_inicio', '>=', data_inicio);
    }
    if (data_fim) {
      query.where('data_fim', '<=', data_fim);
    }

    const data = await query;
    if (data.error) throw data.error;

    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const getVisitasPorImovel = async (req, res, next) => {
  try {
    const { data, error } = await knex('agendamentos')
      .select(`
        *,
        imovel:imovel_id(*)
      `)
      .orderBy('data');

    if (error) throw error;

    const visitas = data.reduce((acc, agend) => {
      const imovel = agend.imovel;
      if (!acc[imovel.id]) {
        acc[imovel.id] = {
          imovel: imovel,
          total_visitas: 0,
          realizadas: 0,
          canceladas: 0,
          pendentes: 0
        };
      }
      acc[imovel.id].total_visitas++;
      acc[imovel.id][agend.status]++;
      return acc;
    }, {});

    res.json(Object.values(visitas));
  } catch (error) {
    next(error);
  }
};