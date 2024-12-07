export const up = function(knex) { 
  console.log('Criando tabela usuarios...');
  return knex.schema.createTable('usuarios', table => {
    console.log('Definindo colunas...');
    table.increments('id').primary();
    table.string('email').notNullable().unique();
    table.string('nome').notNullable();
    table.string('telefone').notNullable();
    table.string('senha').notNullable();
    table.enu('tipo', ['admin', 'corretor', 'cliente'])
      .notNullable()
      .defaultTo('cliente');
    table.timestamps(true, true);
    console.log('Colunas definidas com sucesso!');
  }).then(() => {
    console.log('Tabela usuarios criada com sucesso!');
  });
};

export const down = function(knex) {
  return knex.schema.dropTable('usuarios');
}; 