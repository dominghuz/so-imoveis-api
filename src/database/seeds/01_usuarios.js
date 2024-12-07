import bcrypt from 'bcrypt';

export const seed = async function(knex) {
  // Limpa as tabelas
  await knex('clientes').del();
  await knex('usuarios').del();
  
  const senha = await bcrypt.hash('senha123', 10);
  
  // Insere usuários
  await knex('usuarios').insert([
    {
      email: 'admin@teste.com',
      nome: 'Administrador',
      telefone: '999999999',
      senha: senha,
      tipo: 'admin'
    },
    {
      email: 'corretor@teste.com',
      nome: 'Corretor Teste',
      telefone: '888888888',
      senha: senha,
      tipo: 'corretor'
    }
  ]);
}; 