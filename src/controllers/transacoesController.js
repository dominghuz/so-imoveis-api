import knex from '../database/connection';

export const transacoesController = {
  async listar(req, res) {
    try {
      const { periodo, tipo, status } = req.query;
      
      let query = knex('transacoes')
        .select(
          'transacoes.*',
          'imoveis.tipo as imovel_tipo',
          'imoveis.finalidade',
          'imoveis.cidade',
          'imoveis.bairro',
          'usuarios_cliente.nome as cliente_nome',
          'usuarios_corretor.nome as corretor_nome'
        )
        .join('imoveis', 'transacoes.imovel_id', 'imoveis.id')
        .join('usuarios as usuarios_cliente', 'transacoes.cliente_id', 'usuarios_cliente.id')
        .join('usuarios as usuarios_corretor', 'transacoes.corretor_id', 'usuarios_corretor.id');

      // Filtro por período
      if (periodo === 'mes') {
        const inicioMes = new Date();
        inicioMes.setDate(1);
        query = query.where('transacoes.data_inicio', '>=', inicioMes.toISOString().split('T')[0]);
      }

      // Filtro por tipo
      if (tipo && tipo !== 'todos') {
        query = query.where('transacoes.tipo', tipo);
      }

      // Filtro por status
      if (status && status !== 'todos') {
        query = query.where('transacoes.status', status);
      }

      const transacoes = await query;

      return res.json({
        success: true,
        data: transacoes
      });

    } catch (error) {
      console.error('Erro ao listar transações:', error);
      return res.status(500).json({
        success: false,
        error: 'Erro ao buscar transações'
      });
    }
  }
}; 