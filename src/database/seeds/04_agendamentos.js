export async function seed(knex) {
  try {
    // Limpa a tabela antes de inserir
    console.log('Limpando tabela de agendamentos...');
    await knex('agendamentos').del();

    // Busca dados e loga resultados
    console.log('Buscando imóveis e usuários...');
    
    const imoveis = await knex('imoveis').select('id', 'tipo', 'cidade');
    console.log('Imóveis encontrados:', imoveis.length);
    
    const usuarios = await knex('usuarios').select('id', 'nome', 'tipo');
    console.log('Usuários encontrados:', usuarios.length);
    
    // Separa usuários por tipo
    const clientes = usuarios.filter(u => u.tipo === 'cliente');
    const corretores = usuarios.filter(u => u.tipo === 'corretor');
    
    console.log('Clientes encontrados:', clientes.length);
    console.log('Corretores encontrados:', corretores.length);

    // Se não houver dados suficientes, cria dados básicos
    if (!imoveis.length) {
      console.log('Criando imóvel padrão...');
      const [imovelId] = await knex('imoveis').insert({
        tipo: 'Casa',
        rua: 'Rua Teste',
        numero: '123',
        bairro: 'Centro',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01234-567',
        valor: 500000.00,
        status: 'disponivel'
      }).returning('id');
      imoveis.push({ id: imovelId, tipo: 'Casa', cidade: 'São Paulo' });
    }

    if (!corretores.length) {
      console.log('Criando corretor padrão...');
      const [corretorId] = await knex('usuarios').insert({
        nome: 'Corretor Padrão',
        email: 'corretor.padrao@teste.com',
        telefone: '11999999999',
        senha: '$2b$10$xFvPvhpf1F5vR8c5f5tK8eVZ.0qvLR7wCxXGoB3XYX3Jp6K0h6DmC', // senha123
        tipo: 'corretor'
      }).returning('id');
      corretores.push({ id: corretorId, nome: 'Corretor Padrão', tipo: 'corretor' });
    }

    if (!clientes.length) {
      console.log('Criando cliente padrão...');
      const [clienteId] = await knex('usuarios').insert({
        nome: 'Cliente Padrão',
        email: 'cliente.padrao@teste.com',
        telefone: '11988888888',
        senha: '$2b$10$xFvPvhpf1F5vR8c5f5tK8eVZ.0qvLR7wCxXGoB3XYX3Jp6K0h6DmC', // senha123
        tipo: 'cliente'
      }).returning('id');
      clientes.push({ id: clienteId, nome: 'Cliente Padrão', tipo: 'cliente' });
    }

    // Data base para os agendamentos (hoje)
    const hoje = new Date();
    
    // Função para adicionar dias a uma data
    const addDias = (data, dias) => {
      const novaData = new Date(data);
      novaData.setDate(novaData.getDate() + dias);
      return novaData.toISOString().split('T')[0];
    };

    // Cria agendamentos
    const agendamentos = [
      {
        imovel_id: imoveis[0].id,
        cliente_id: clientes[0].id,
        corretor_id: corretores[0].id,
        data: addDias(hoje, 1),
        hora: '09:00:00',
        status: 'pendente',
        observacoes: 'Primeira visita ao imóvel'
      },
      {
        imovel_id: imoveis[0].id,
        cliente_id: clientes[0].id,
        corretor_id: corretores[0].id,
        data: addDias(hoje, 2),
        hora: '14:30:00',
        status: 'confirmado',
        observacoes: 'Segunda visita confirmada'
      }
    ];

    console.log('Inserindo agendamentos:', agendamentos);
    
    // Insere os agendamentos
    await knex('agendamentos').insert(agendamentos);

    // Verifica se os agendamentos foram inseridos
    const agendamentosInseridos = await knex('agendamentos').select('*');
    console.log(`Agendamentos inseridos com sucesso! Total: ${agendamentosInseridos.length}`);
    
    return true;
  } catch (error) {
    console.error('Erro ao inserir seeds de agendamentos:', error);
    console.error('Detalhes do erro:', error.message);
    throw error;
  }
} 