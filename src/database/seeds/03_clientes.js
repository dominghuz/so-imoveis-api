export const seed = async function(knex) {
  // Limpa a tabela antes de inserir
  await knex('clientes').del();
  
  // Insere os clientes
  await knex('clientes').insert([
    {
      nome: 'João Silva',
      bi: '12345678901234',
      email: 'joao@exemplo.com',
      telefone: '11999999999',
      data_nascimento: '1990-01-01',
      endereco: 'Rua das Flores, 123',
      bairro: 'Centro',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01234567',
      profissao: 'Engenheiro',
      renda_mensal: 10000.00,
      interesse: 'Compra',
      tipo_imovel_interesse: JSON.stringify(['Apartamento', 'Casa']),
      observacoes: 'Busca imóvel próximo ao metrô'
    },
    {
      nome: 'Maria Santos',
      bi: '98765432109876',
      email: 'maria@exemplo.com',
      telefone: '11988888888',
      data_nascimento: '1985-05-15',
      endereco: 'Av. Paulista, 1000',
      bairro: 'Bela Vista',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01310100',
      profissao: 'Médica',
      renda_mensal: 15000.00,
      interesse: 'Aluguel',
      tipo_imovel_interesse: JSON.stringify(['Apartamento']),
      observacoes: 'Prefere apartamentos novos'
    },
    {
      nome: 'Pedro Oliveira',
      bi: '45678901234567',
      email: 'pedro@exemplo.com',
      telefone: '11977777777',
      data_nascimento: '1988-10-20',
      endereco: 'Rua Augusta, 500',
      bairro: 'Consolação',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01304000',
      profissao: 'Advogado',
      renda_mensal: 12000.00,
      interesse: 'Ambos',
      tipo_imovel_interesse: JSON.stringify(['Casa', 'Cobertura']),
      observacoes: 'Interesse em imóveis de alto padrão'
    }
  ]);
}; 