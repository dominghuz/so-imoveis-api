import knex from '../database/connection.js';
import Imovel from '../models/Imovel.js';

export const getDashboardStats = async (req, res) => {
  try {
    // Buscar todos os imóveis com informações relevantes
    const imoveis = await knex('imoveis')
      .select(
        'imoveis.id',
        'imoveis.status',
        'imoveis.tipo',
        'imoveis.finalidade',
        'imoveis.preco',
        'usuarios.nome as corretor'
      )
      .leftJoin('usuarios', 'imoveis.corretor_id', 'usuarios.id');

    // Calcular estatísticas
    const stats = {
      total: imoveis.length,
      por_status: {
        disponivel: imoveis.filter(i => i.status === 'disponivel').length,
        vendido: imoveis.filter(i => i.status === 'vendido').length,
        alugado: imoveis.filter(i => i.status === 'alugado').length
      },
      por_tipo: imoveis.reduce((acc, curr) => {
        acc[curr.tipo] = (acc[curr.tipo] || 0) + 1;
        return acc;
      }, {}),
      por_finalidade: imoveis.reduce((acc, curr) => {
        acc[curr.finalidade] = (acc[curr.finalidade] || 0) + 1;
        return acc;
      }, {}),
      valor_total: {
        venda: imoveis
          .filter(i => i.finalidade === 'venda')
          .reduce((acc, curr) => acc + Number(curr.preco), 0),
        aluguel: imoveis
          .filter(i => i.finalidade === 'aluguel')
          .reduce((acc, curr) => acc + Number(curr.preco), 0)
      }
    };

    return res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Erro ao buscar estatísticas',
      details: error.message 
    });
  }
};

export const getImoveisPorTipo = async (req, res) => {
  try {
    // Corrigindo a query para selecionar as colunas corretamente
    const imoveis = await knex('imoveis')
      .select(['tipo', 'status']) // Usando array para selecionar múltiplas colunas
      .orderBy('tipo', 'asc');

    console.log('Imóveis encontrados:', imoveis); // Log para debug

    const stats = imoveis.reduce((acc, curr) => {
      if (!acc[curr.tipo]) {
        acc[curr.tipo] = {
          total: 0,
          disponivel: 0,
          vendido: 0,
          alugado: 0
        };
      }
      acc[curr.tipo].total++;
      acc[curr.tipo][curr.status]++;
      return acc;
    }, {});

    return res.json({
      success: true,
      data: stats,
      total_registros: imoveis.length
    });

  } catch (error) {
    console.error('Erro ao buscar imóveis por tipo:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Erro ao buscar imóveis por tipo',
      details: error.message 
    });
  }
};

export const getImoveisPorStatus = async (req, res) => {
  try {
    // Corrigindo a query para selecionar as colunas corretamente
    const imoveis = await knex('imoveis')
      .select(['status', 'tipo']) // Usando array para selecionar múltiplas colunas
      .orderBy('status', 'asc');

    console.log('Imóveis encontrados:', imoveis); // Log para debug

    const stats = imoveis.reduce((acc, curr) => {
      if (!acc[curr.status]) {
        acc[curr.status] = {
          total: 0,
          tipos: {}
        };
      }
      acc[curr.status].total++;
      acc[curr.status].tipos[curr.tipo] = (acc[curr.status].tipos[curr.tipo] || 0) + 1;
      return acc;
    }, {});

    return res.json({
      success: true,
      data: stats,
      total_registros: imoveis.length
    });

  } catch (error) {
    console.error('Erro ao buscar imóveis por status:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Erro ao buscar imóveis por status',
      details: error.message 
    });
  }
};
