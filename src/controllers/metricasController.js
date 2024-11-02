import supabase from '../config/supabase.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    // Estatísticas de Imóveis
    const { data: imoveis, error: imoveisError } = await supabase
      .from('imoveis')
      .select('id, status, tipo, finalidade');

    if (imoveisError) throw imoveisError;

    // Estatísticas de Transações
    const { data: transacoes, error: transacoesError } = await supabase
      .from('transacoes')
      .select('*');

    if (transacoesError) throw transacoesError;

    // Estatísticas de Agendamentos
    const { data: agendamentos, error: agendamentosError } = await supabase
      .from('agendamentos')
      .select('*');

    if (agendamentosError) throw agendamentosError;

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
        valor_total: transacoes.reduce((acc, curr) => acc + parseFloat(curr.valor), 0)
      },
      agendamentos: {
        total: agendamentos.length,
        pendentes: agendamentos.filter(a => a.status === 'pendente').length,
        realizados: agendamentos.filter(a => a.status === 'realizado').length,
        cancelados: agendamentos.filter(a => a.status === 'cancelado').length
      }
    };

    res.json(stats);
  } catch (error) {
    next(error);
  }
};

export const getVendasPorPeriodo = async (req, res, next) => {
  try {
    const { data_inicio, data_fim } = req.query;
    
    let query = supabase
      .from('transacoes')
      .select('*')
      .eq('tipo', 'venda');

    if (data_inicio) {
      query = query.gte('data_inicio', data_inicio);
    }
    if (data_fim) {
      query = query.lte('data_fim', data_fim);
    }

    const { data, error } = await query;
    if (error) throw error;

    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const getLocacoesPorPeriodo = async (req, res, next) => {
  try {
    const { data_inicio, data_fim } = req.query;
    
    let query = supabase
      .from('transacoes')
      .select('*')
      .eq('tipo', 'aluguel');

    if (data_inicio) {
      query = query.gte('data_inicio', data_inicio);
    }
    if (data_fim) {
      query = query.lte('data_fim', data_fim);
    }

    const { data, error } = await query;
    if (error) throw error;

    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const getImoveisPorTipo = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('imoveis')
      .select('tipo, status')
      .order('tipo');

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
    const { data, error } = await supabase
      .from('imoveis')
      .select('status, tipo')
      .order('status');

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
    
    let query = supabase
      .from('transacoes')
      .select(`
        *,
        imovel:imovel_id(*),
        cliente:cliente_id(*),
        corretor:corretor_id(*)
      `)
      .order('data_inicio');

    if (data_inicio) {
      query = query.gte('data_inicio', data_inicio);
    }
    if (data_fim) {
      query = query.lte('data_fim', data_fim);
    }

    const { data, error } = await query;
    if (error) throw error;

    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const getComissoesPorCorretor = async (req, res, next) => {
  try {
    const { data_inicio, data_fim } = req.query;
    
    let query = supabase
      .from('transacoes')
      .select(`
        *,
        corretor:corretor_id(*)
      `);

    if (data_inicio) {
      query = query.gte('data_inicio', data_inicio);
    }
    if (data_fim) {
      query = query.lte('data_fim', data_fim);
    }

    const { data, error } = await query;
    if (error) throw error;

    const comissoes = data.reduce((acc, trans) => {
      const corretor = trans.corretor;
      if (!acc[corretor.id]) {
        acc[corretor.id] = {
          corretor: corretor,
          total_transacoes: 0,
          valor_total: 0,
          comissao_total: 0
        };
      }
      acc[corretor.id].total_transacoes++;
      acc[corretor.id].valor_total += parseFloat(trans.valor);
      // Calcula comissão (exemplo: 5% para vendas, 10% primeiro aluguel)
      const comissao = trans.tipo === 'venda' ? trans.valor * 0.05 : trans.valor * 0.1;
      acc[corretor.id].comissao_total += comissao;
      return acc;
    }, {});

    res.json(Object.values(comissoes));
  } catch (error) {
    next(error);
  }
};

export const getVisitasPorImovel = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('agendamentos')
      .select(`
        *,
        imovel:imovel_id(*)
      `)
      .order('data');

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

export const getConversaoPorCorretor = async (req, res, next) => {
  try {
    // Buscar agendamentos e transações
    const [agendamentos, transacoes] = await Promise.all([
      supabase.from('agendamentos').select('*,corretor:corretor_id(*)'),
      supabase.from('transacoes').select('*,corretor:corretor_id(*)')
    ]);

    if (agendamentos.error) throw agendamentos.error;
    if (transacoes.error) throw transacoes.error;

    const conversao = agendamentos.data.reduce((acc, agend) => {
      const corretor = agend.corretor;
      if (!acc[corretor.id]) {
        acc[corretor.id] = {
          corretor: corretor,
          total_visitas: 0,
          visitas_realizadas: 0,
          vendas_alugueis: 0,
          taxa_conversao: 0
        };
      }
      acc[corretor.id].total_visitas++;
      if (agend.status === 'realizado') {
        acc[corretor.id].visitas_realizadas++;
      }
      return acc;
    }, {});

    // Adicionar transações concluídas
    transacoes.data.forEach(trans => {
      if (trans.status === 'concluido' && conversao[trans.corretor.id]) {
        conversao[trans.corretor.id].vendas_alugueis++;
      }
    });

    // Calcular taxa de conversão
    Object.values(conversao).forEach(c => {
      c.taxa_conversao = c.visitas_realizadas > 0 
        ? (c.vendas_alugueis / c.visitas_realizadas) * 100 
        : 0;
    });

    res.json(Object.values(conversao));
  } catch (error) {
    next(error);
  }
}; 