export const seed = async function(knex) {
  try {
    // Limpa a tabela de transações
    await knex('transacoes').del();

    // Busca IDs existentes
    const imoveis = await knex('imoveis').select('id', 'finalidade', 'preco');
    const clientes = await knex('usuarios').where('tipo', 'cliente').select('id');
    const corretores = await knex('usuarios').where('tipo', 'corretor').select('id');

    // Verifica se existem registros necessários
    if (!imoveis.length || !clientes.length || !corretores.length) {
      console.log('Não há dados suficientes para criar transações. Execute primeiro os seeds de usuários e imóveis.');
      return;
    }

    // Dados para seed
    const transacoes = [
      {
        imovel_id: imoveis[0].id,
        cliente_id: clientes[0].id,
        corretor_id: corretores[0].id,
        tipo: imoveis[0].finalidade,
        valor: imoveis[0].preco,
        status: 'concluido',
        data_inicio: '2024-01-15',
        data_fim: '2024-02-15',
        contrato_url: 'https://exemplo.com/contratos/1.pdf'
      },
      {
        imovel_id: imoveis[1] ? imoveis[1].id : imoveis[0].id,
        cliente_id: clientes[0].id,
        corretor_id: corretores[0].id,
        tipo: imoveis[1] ? imoveis[1].finalidade : imoveis[0].finalidade,
        valor: imoveis[1] ? imoveis[1].preco : 2000.00,
        status: 'pendente',
        data_inicio: '2024-03-01',
        data_fim: null,
        contrato_url: null
      }
    ];

    // Insere as transações
    await knex('transacoes').insert(transacoes);

    // Atualiza status dos imóveis das transações concluídas
    for (const transacao of transacoes) {
      if (transacao.status === 'concluido') {
        await knex('imoveis')
          .where('id', transacao.imovel_id)
          .update({
            status: transacao.tipo === 'venda' ? 'vendido' : 'alugado'
          });
      }
    }

    console.log('Seed de transações executado com sucesso!');
  } catch (error) {
    console.error('Erro ao executar seed de transações:', error);
    throw error;
  }
}; 