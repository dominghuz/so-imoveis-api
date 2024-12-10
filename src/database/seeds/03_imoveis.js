export const seed = async function(knex) {
  try {
    console.log('Iniciando seed de imóveis...');

    // Limpa a tabela antes de inserir
    await knex('imoveis').del();
    console.log('Tabela de imóveis limpa');
    
    // Busca os IDs dos corretores
    const corretores = await knex('usuarios')
      .where('tipo', 'corretor')
      .select(['id']);
    
    if (corretores.length === 0) {
      console.log('Nenhum corretor encontrado. Criando corretor...');
      
      // Cria um corretor se não existir nenhum
      const [corretor] = await knex('usuarios').insert({
        nome: 'Corretor Teste',
        email: 'corretor@teste.com',
        senha: '$2b$10$xGfzvPLX5wWGqp0MJKFZwePUy5M8nJ4FqbHqEgFb8WyF9vQMqO1tq', // senha123
        telefone: '11999999999',
        tipo: 'corretor'
      }).returning('id');

      corretores.push({ id: corretor });
    }

    const corretor_id = corretores[0].id;
    
    const imoveis = [
      {
        // Nao aparece
        tipo: 'Apartamento',
        titulo: 'Apartamento Moderno em Talatona',
        finalidade: 'venda',
        preco: 500000.00,
        cidade: 'Luanda',
        bairro: 'Talatona',
        endereco: 'Rua do Comércio, 123',
        numero: '123',
        complemento: 'Apto 51',
        cep: '04524-001',
        area: 120.00,
        vagas: 2,
        quartos: 3,
        banheiros: 2,
        descricao: 'Apartamento moderno com vista panorâmica, localizado em Talatona, próximo a centros comerciais e escolas internacionais.',
        status: 'disponivel',
        destaque: true,
        imagem: 'https://images.pexels.com/photos/1918291/pexels-photo-1918291.jpeg',
        corretor_id
      },
      {
        tipo: 'Casa',
        titulo: 'Casa Espetacular em Benfica',
        finalidade: 'aluguel',
        preco: 4000.00,
        cidade: 'Luanda',
        bairro: 'Benfica',
        endereco: 'Rua das Flores, 456',
        numero: '456',
        complemento: '',
        cep: '05424-150',
        area: 150.00,
        vagas: 3,
        quartos: 4,
        banheiros: 3,
        descricao: 'Casa espaçosa com jardim privativo, ideal para famílias, localizada em um bairro tranquilo e seguro.',
        status: 'disponivel',
        destaque: false,
        imagem: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg',
        corretor_id
      },
      {
        // Nao aparece
        tipo: 'Apartamento',
        titulo: 'Apartamento com Vista para o Mar em Miramar',
        finalidade: 'venda',
        preco: 600000.00,
        cidade: 'Luanda',
        bairro: 'Miramar',
        endereco: 'Avenida Principal, 789',
        numero: '789',
        complemento: 'Torre 1, Apto 302',
        cep: '04543-110',
        area: 100.00,
        vagas: 2,
        quartos: 3,
        banheiros: 2,
        descricao: 'Apartamento de luxo com vista para o mar, acabamento de alta qualidade e área de lazer completa.',
        status: 'disponivel',
        destaque: true,
        imagem: 'https://images.pexels.com/photos/2462015/pexels-photo-2462015.jpeg',
        corretor_id
      },
      {
        // Nao aparece
        tipo: 'Casa',
        titulo: 'Mansão de Luxo em Alvalade',
        finalidade: 'venda',
        preco: 1200000.00,
        cidade: 'Luanda',
        bairro: 'Alvalade',
        endereco: 'Rua dos Coqueiros, 321',
        numero: '321',
        complemento: '',
        cep: '05422-030',
        area: 300.00,
        vagas: 4,
        quartos: 5,
        banheiros: 4,
        descricao: 'Mansão de alto padrão com piscina, jardim paisagístico e segurança 24 horas, localizada em área nobre.',
        status: 'disponivel',
        destaque: true,
        imagem: 'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg',
        corretor_id
      },
      {
        tipo: 'Apartamento',
        titulo: 'Studio Funcional na Maianga',
        finalidade: 'aluguel',
        preco: 1500.00,
        cidade: 'Luanda',
        bairro: 'Maianga',
        endereco: 'Rua da Maianga, 100',
        numero: '100',
        complemento: 'Edifício Central, Apto 505',
        cep: '13084-050',
        area: 50.00,
        vagas: 1,
        quartos: 1,
        banheiros: 1,
        descricao: 'Studio moderno e funcional, totalmente mobiliado, ideal para jovens profissionais.',
        status: 'disponivel',
        destaque: false,
        imagem: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg',
        corretor_id
      }
    ];

    await knex('imoveis').insert(imoveis);
    console.log('Seeds de imóveis inseridos com sucesso!');
  } catch (error) {
    console.error('Erro ao inserir imóveis:', error);
    throw error;
  }
};
