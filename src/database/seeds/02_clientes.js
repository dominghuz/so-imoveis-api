import bcrypt from 'bcrypt';

export const seed = async function(knex) {
  try {
    const senha = await bcrypt.hash('senha123', 10);
  
  // Pega o ID do usuário cliente que será criado
  const [usuario] = await knex('usuarios').insert({
    email: 'cliente@teste.com',
    nome: 'Cliente Teste',
    telefone: '777777777',
    senha: senha,
    tipo: 'cliente'
  }).returning('id');

  // Insere cliente
  await knex('clientes').insert({
    usuario_id: usuario.id,
    bi: '123456789',
    data_nascimento: '1990-01-01',
    endereco: 'Rua Teste, 123',
    bairro: 'Centro',
    cidade: 'São Paulo',
    estado: 'SP',
    cep: '01234-567',
    profissao: 'Desenvolvedor',
    renda_mensal: 5000.00,
    interesse: 'Compra',
    tipo_imovel_interesse: JSON.stringify(['Casa', 'Apartamento']),
    observacoes: 'Cliente teste'
    });
    console.log('Seeds de clientes inseridos com sucesso!');
  } catch (error) {
    console.error('Erro ao inserir clientes:', error);
    throw error;
  }
}; 