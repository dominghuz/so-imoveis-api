export const seed = async function(knex) {
  // Limpa a tabela antes de inserir
  await knex('imoveis').del();
  
  // Busca os IDs dos corretores
  const [joao, maria] = await knex('usuarios').select('id');
  
  // Insere os imóveis
  await knex('imoveis').insert([
    {
      tipo: 'Apartamento',
      finalidade: 'venda',
      preco: 450000.00,
      cidade: 'São Paulo',
      bairro: 'Moema',
      rua: 'Rua dos Pássaros',
      numero: '123',
      complemento: 'Apto 51',
      metragem: 85.50,
      vagas: 2,
      quartos: 3,
      banheiros: 2,
      descricao: 'Lindo apartamento com varanda gourmet',
      status: 'disponivel',
      destaque: true,
      imagem: 'https://exemplo.com/imagem1.jpg',
      corretor_id: joao.id
    },
    {
      tipo: 'Casa',
      finalidade: 'aluguel',
      preco: 3500.00,
      cidade: 'São Paulo',
      bairro: 'Perdizes',
      rua: 'Rua das Flores',
      numero: '456',
      complemento: '',
      metragem: 120.00,
      vagas: 3,
      quartos: 4,
      banheiros: 3,
      descricao: 'Casa espaçosa com quintal',
      status: 'disponivel',
      destaque: false,
      imagem: 'https://exemplo.com/imagem2.jpg',
      corretor_id: maria.id
    },
    {
      tipo: 'Cobertura',
      finalidade: 'venda',
      preco: 1200000.00,
      cidade: 'São Paulo',
      bairro: 'Vila Nova Conceição',
      rua: 'Rua dos Jacarandás',
      numero: '789',
      complemento: 'Cobertura 1',
      metragem: 200.00,
      vagas: 4,
      quartos: 4,
      banheiros: 5,
      descricao: 'Cobertura duplex com piscina',
      status: 'disponivel',
      destaque: true,
      imagem: 'https://exemplo.com/imagem3.jpg',
      corretor_id: joao.id
    },
    {
      tipo: 'Studio',
      finalidade: 'aluguel',
      preco: 2500.00,
      cidade: 'São Paulo',
      bairro: 'Pinheiros',
      rua: 'Rua dos Pinheiros',
      numero: '321',
      complemento: 'Studio 15',
      metragem: 35.00,
      vagas: 1,
      quartos: 1,
      banheiros: 1,
      descricao: 'Studio moderno e bem localizado',
      status: 'disponivel',
      destaque: false,
      imagem: 'https://exemplo.com/imagem4.jpg',
      corretor_id: maria.id
    }
  ]);
}; 