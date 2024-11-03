export const seed = async function(knex) {
  // Limpa a tabela antes de inserir
  await knex('usuarios').del();
  
  // Insere os usuários
  await knex('usuarios').insert([
    {
      nome: 'Admin',
      email: 'admin@imobiliaria.com',
      telefone: '(11) 99999-9999',
      // senha: 123456 (já hasheada com bcrypt)
      senha: '$2b$10$5YZ9jWX6iRiQvV9V9vV9v.5YZ9jWX6iRiQvV9V9vV9v',
      tipo: 'admin'
    },
    {
      nome: 'João Corretor',
      email: 'joao@imobiliaria.com',
      telefone: '(11) 98888-8888',
      senha: '$2b$10$5YZ9jWX6iRiQvV9V9vV9v.5YZ9jWX6iRiQvV9V9vV9v',
      tipo: 'corretor'
    },
    {
      nome: 'Maria Corretora',
      email: 'maria@imobiliaria.com',
      telefone: '(11) 97777-7777',
      senha: '$2b$10$5YZ9jWX6iRiQvV9V9vV9v.5YZ9jWX6iRiQvV9V9vV9v',
      tipo: 'corretor'
    },
    {
      nome: 'Cliente Teste',
      email: 'cliente@teste.com',
      telefone: '(11) 96666-6666',
      senha: '$2b$10$5YZ9jWX6iRiQvV9V9vV9v.5YZ9jWX6iRiQvV9V9vV9v',
      tipo: 'cliente'
    }
  ]);
}; 