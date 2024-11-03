export const up = function(knex) {
  console.log('Criando tabela clientes...');
  return knex.schema.createTable('clientes', table => {
    console.log('Definindo colunas...');
    
    // Identificação
    table.increments('id').primary(); // SQLite não suporta UUID nativamente
    table.string('nome', 100).notNullable();
    table.string('bi', 14).notNullable().unique();
    table.string('email', 100).notNullable().unique();
    table.string('telefone', 15).notNullable();
    
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
    table.string('interesse').checkIn(['Compra', 'Aluguel', 'Ambos']); // Enum simulado
    table.text('tipo_imovel_interesse'); // Vamos armazenar como JSON string
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