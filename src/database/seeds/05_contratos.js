export const seed = async function(knex) {
  try {
    // Limpa a tabela
    await knex('contratos').del();

    // Busca IDs necessários
    const imoveis = await knex('imoveis').select('id').limit(1);
    const clientes = await knex('usuarios').where('tipo', 'cliente').select('id');
    const corretores = await knex('usuarios').where('tipo', 'corretor').select('id');

    if (!imoveis.length || !clientes.length || !corretores.length) {
      console.log('Dados necessários não encontrados para criar contratos');
      return;
    }

    // Cria contratos de teste
    const contratos = [
      {
        imovel_id: imoveis[0].id,
        cliente_id: clientes[0].id,
        corretor_id: corretores[0].id,
        tipo: 'venda',
        valor: 500000.00,
        data_inicio: new Date().toISOString().split('T')[0],
        status: 'pendente',
        observacoes: 'Contrato de venda pendente de assinatura'
      },
      {
        imovel_id: imoveis[0].id,
        cliente_id: clientes[0].id,
        corretor_id: corretores[0].id,
        tipo: 'aluguel',
        valor: 2000.00,
        data_inicio: new Date().toISOString().split('T')[0],
        data_fim: new Date(Date.now() + 31536000000).toISOString().split('T')[0], // +1 ano
        status: 'assinado',
        observacoes: 'Contrato de aluguel assinado'
      }
    ];

    await knex('contratos').insert(contratos);
    console.log('Seeds de contratos inseridos com sucesso!');
  } catch (error) {
    console.error('Erro ao inserir contratos:', error);
    throw error;
  }
}; 