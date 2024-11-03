export const up = function(knex) {
  console.log('Criando tabela agendamentos...');
  return knex.schema.createTable('agendamentos', table => {
    console.log('Definindo colunas...');
    
    table.increments('id').primary(); // SQLite não suporta UUID nativamente
    table.integer('imovel_id').unsigned()
      .references('id')
      .inTable('imoveis')
      .onDelete('CASCADE')
      .notNullable();
    table.integer('cliente_id').unsigned()
      .references('id')
      .inTable('usuarios')
      .onDelete('CASCADE')
      .notNullable();
    table.integer('corretor_id').unsigned()
      .references('id')
      .inTable('usuarios')
      .onDelete('CASCADE')
      .notNullable();
    table.date('data').notNullable();
    table.time('hora').notNullable();
    table.enu('status', ['pendente', 'confirmado', 'cancelado', 'realizado'])
      .notNullable()
      .defaultTo('pendente');
    table.text('observacoes');
    table.timestamps(true, true);
    
    console.log('Colunas definidas com sucesso!');
  }).then(() => {
    console.log('Tabela agendamentos criada com sucesso!');
  });
};

export const down = function(knex) {
  return knex.schema.dropTable('agendamentos');
}; 