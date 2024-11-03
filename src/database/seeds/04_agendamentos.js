export async function seed(knex) {
  try {
    // Limpa a tabela antes de inserir
    await knex('agendamentos').del();

    // Busca IDs existentes para referência
    const imoveis = await knex('imoveis').select('id').limit(3);
    const usuarios = await knex('usuarios').select('id', 'tipo');
    
    const clientes = usuarios.filter(u => u.tipo === 'cliente').map(u => u.id);
    const corretores = usuarios.filter(u => u.tipo === 'corretor').map(u => u.id);

    // Verifica se existem dados necessários
    if (!imoveis.length || !clientes.length || !corretores.length) {
      console.log('Não há dados suficientes para criar agendamentos');
      return;
    }

    // Insere os agendamentos
    await knex('agendamentos').insert([
      {
        imovel_id: imoveis[0].id,
        cliente_id: clientes[0],
        corretor_id: corretores[0],
        data: '2024-03-25',
        hora: '10:00',
        status: 'pendente',
        observacoes: 'Cliente interessado em conhecer o imóvel'
      },
      {
        imovel_id: imoveis[1].id,
        cliente_id: clientes[0],
        corretor_id: corretores[0],
        data: '2024-03-26',
        hora: '14:30',
        status: 'confirmado',
        observacoes: 'Segunda visita para avaliação detalhada'
      },
      {
        imovel_id: imoveis[2].id,
        cliente_id: clientes[0],
        corretor_id: corretores[0],
        data: '2024-03-27',
        hora: '16:00',
        status: 'realizado',
        observacoes: 'Cliente gostou do imóvel e vai fazer proposta'
      },
      {
        imovel_id: imoveis[0].id,
        cliente_id: clientes[0],
        corretor_id: corretores[0],
        data: '2024-03-28',
        hora: '09:00',
        status: 'cancelado',
        observacoes: 'Cliente precisou remarcar'
      },
      {
        imovel_id: imoveis[1].id,
        cliente_id: clientes[0],
        corretor_id: corretores[0],
        data: '2024-03-29',
        hora: '11:30',
        status: 'pendente',
        observacoes: 'Primeira visita ao imóvel'
      }
    ]);

    console.log('Seeds de agendamentos inseridos com sucesso!');
  } catch (error) {
    console.error('Erro ao inserir seeds de agendamentos:', error);
    throw error;
  }
} 