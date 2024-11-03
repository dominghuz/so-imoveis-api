export const up = function(knex) {
  console.log('Criando tabela usuarios...');
  return knex.schema.createTable('usuarios', table => {
    console.log('Definindo colunas...');
    table.increments('id').primary(); // SQLite não suporta UUID nativamente
    table.string('email').notNullable().unique();
    table.string('nome').notNullable();
    table.string('telefone');
    table.string('senha').notNullable();
    table.enu('tipo', ['admin', 'corretor', 'cliente'])
      .notNullable()
      .defaultTo('cliente');
    table.timestamps(true, true); // created_at e updated_at
    console.log('Colunas definidas com sucesso!');
  }).then(() => {
    console.log('Tabela usuarios criada com sucesso!');
  });
};

export const down = function(knex) {
  return knex.schema.dropTable('usuarios');
}; 