import knex from '../database/connection';

export const transacoesController = {
  // Listar todas as transações
  async listar(req, res) {
    try {
      const transacoes = await knex('transacoes')
        .select(
          'transacoes.*',
          'imoveis.tipo as imovel_tipo',
          'imoveis.finalidade',
          'clientes.nome as cliente_nome',
          'corretores.nome as corretor_nome'
        )
        .join('imoveis', 'transacoes.imovel_id', 'imoveis.id')
        .join('usuarios as clientes', 'transacoes.cliente_id', 'clientes.id')
        .join('usuarios as corretores', 'transacoes.corretor_id', 'corretores.id');
      
      return res.json(transacoes);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  // Buscar uma transação específica
  async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const transacao = await knex('transacoes')
        .select(
          'transacoes.*',
          'imoveis.tipo as imovel_tipo',
          'imoveis.finalidade',
          'clientes.nome as cliente_nome',
          'corretores.nome as corretor_nome'
        )
        .join('imoveis', 'transacoes.imovel_id', 'imoveis.id')
        .join('usuarios as clientes', 'transacoes.cliente_id', 'clientes.id')
        .join('usuarios as corretores', 'transacoes.corretor_id', 'corretores.id')
        .where('transacoes.id', id)
        .first();

      if (!transacao) {
        return res.status(404).json({ error: 'Transação não encontrada' });
      }

      return res.json(transacao);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  // Criar nova transação
  async criar(req, res) {
    try {
      const {
        imovel_id,
        cliente_id,
        corretor_id,
        tipo,
        valor,
        data_inicio,
        data_fim,
        contrato_url
      } = req.body;

      // Validações básicas
      if (!imovel_id || !cliente_id || !corretor_id || !tipo || !valor || !data_inicio) {
        return res.status(400).json({ error: 'Dados obrigatórios não fornecidos' });
      }

      // Verifica se o imóvel está disponível
      const imovel = await knex('imoveis')
        .where('id', imovel_id)
        .where('status', 'disponivel')
        .first();

      if (!imovel) {
        return res.status(400).json({ error: 'Imóvel não disponível para transação' });
      }

      const [transacao] = await knex('transacoes').insert({
        imovel_id,
        cliente_id,
        corretor_id,
        tipo,
        valor,
        data_inicio,
        data_fim,
        contrato_url,
        status: 'pendente'
      }).returning('*');

      // Atualiza o status do imóvel
      await knex('imoveis')
        .where('id', imovel_id)
        .update({
          status: tipo === 'venda' ? 'vendido' : 'alugado'
        });

      return res.status(201).json(transacao);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  // Atualizar status da transação
  async atualizarStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!['pendente', 'concluido', 'cancelado'].includes(status)) {
        return res.status(400).json({ error: 'Status inválido' });
      }

      const transacao = await knex('transacoes')
        .where('id', id)
        .update({ status })
        .returning('*');

      if (status === 'cancelado') {
        // Se cancelado, volta o imóvel para disponível
        await knex('imoveis')
          .where('id', transacao.imovel_id)
          .update({ status: 'disponivel' });
      }

      return res.json(transacao);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  // Excluir transação
  async excluir(req, res) {
    try {
      const { id } = req.params;
      
      const transacao = await knex('transacoes')
        .where('id', id)
        .first();

      if (!transacao) {
        return res.status(404).json({ error: 'Transação não encontrada' });
      }

      await knex('transacoes')
        .where('id', id)
        .del();

      // Volta o imóvel para disponível
      await knex('imoveis')
        .where('id', transacao.imovel_id)
        .update({ status: 'disponivel' });

      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}; 