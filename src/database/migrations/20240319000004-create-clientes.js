export const up = function(knex) {
  console.log('Criando tabela clientes...');
  return knex.schema.createTable('clientes', table => {
    console.log('Definindo colunas...');
    
    // Chave primária e relacionamento com usuário
    table.increments('id').primary();
    table.integer('usuario_id').unsigned().notNullable().unique();
    table.foreign('usuario_id').references('usuarios.id')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
    
    // Documentação
    table.string('bi', 14).notNullable().unique();
    
    // Dados pessoais
    table.date('data_nascimento');
    table.string('endereco', 200);
    table.string('bairro', 100);
    table.string('cidade', 100);
    table.string('estado', 2);
    table.string('cep', 9);
    
    // Dados profissionais e financeiros
    table.string('profissao', 100);
    table.decimal('renda_mensal', 10, 2);
    
    // Interesses
    table.string('interesse').checkIn(['Compra', 'Aluguel', 'Ambos']);
    table.text('tipo_imovel_interesse');
    table.text('observacoes');
    
    // Timestamps
    table.timestamps(true, true);
    
    console.log('Colunas definidas com sucesso!');
  }).then(() => {
    console.log('Tabela clientes criada com sucesso!');
  });
};

export const down = function(knex) {
  return knex.schema.dropTable('clientes');
}; 