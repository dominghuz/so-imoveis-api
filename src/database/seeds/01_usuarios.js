export const seed = async function(knex) {
  // Limpa a tabela antes de inserir
  await knex('usuarios').del();
  
  // Insere os usuários
  await knex('usuarios').insert([
    {
      nome: 'João Corretor',
      email: 'joao@imobiliaria.com',
      // senha: 123456 (já hasheada com bcrypt)
      senha: '$2b$10$5YZ9jWX6iRiQvV9V9vV9v.5YZ9jWX6iRiQvV9V9vV9v'
    },
    {
      nome: 'Maria Corretora',
      email: 'maria@imobiliaria.com',
      senha: '$2b$10$5YZ9jWX6iRiQvV9V9vV9v.5YZ9jWX6iRiQvV9V9vV9v'
    }
  ]);
}; 