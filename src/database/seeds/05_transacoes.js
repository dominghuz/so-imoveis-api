export async function seed(knex) {
  try {
    // Limpa a tabela antes de inserir
    await knex('transacoes').del();

    // Busca IDs existentes para referência
    const imoveis = await knex('imoveis').select('id').limit(3);
    const usuarios = await knex('usuarios').select('id', 'tipo');
    
    const clientes = usuarios.filter(u => u.tipo === 'cliente').map(u => u.id);
    const corretores = usuarios.filter(u => u.tipo === 'corretor').map(u => u.id);

    // Verifica se existem dados necessários
    if (!imoveis.length || !clientes.length || !corretores.length) {
      console.log('Não há dados suficientes para criar transações');
      return;
    }

    // Insere as transações
    await knex('transacoes').insert([
      {
        imovel_id: imoveis[0].id,
        cliente_id: clientes[0],
        corretor_id: corretores[0],
        tipo: 'venda',
        valor: 450000.00,
        status: 'concluido',
        data_inicio: '2024-01-15',
        data_fim: '2024-01-20',
        contrato_url: 'https://exemplo.com/contrato1.pdf'
      },
      {
        imovel_id: imoveis[1].id,
        cliente_id: clientes[0],
        corretor_id: corretores[0],
        tipo: 'aluguel',
        valor: 3500.00,
        status: 'pendente',
        data_inicio: '2024-02-01',
        contrato_url: 'https://exemplo.com/contrato2.pdf'
      },
      {
        imovel_id: imoveis[2].id,
        cliente_id: clientes[0],
        corretor_id: corretores[0],
        tipo: 'venda',
        valor: 850000.00,
        status: 'cancelado',
        data_inicio: '2024-02-15',
        data_fim: '2024-02-20',
        contrato_url: 'https://exemplo.com/contrato3.pdf'
      }
    ]);

    console.log('Seeds de transações inseridos com sucesso!');
  } catch (error) {
    console.error('Erro ao inserir seeds de transações:', error);
    throw error;
  }
} 