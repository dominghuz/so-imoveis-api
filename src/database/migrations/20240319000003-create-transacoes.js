export const up = function(knex) {
  return knex.schema.createTable('transacoes', table => {
    table.increments('id').primary();
    table.integer('imovel_id').unsigned().notNullable();
    table.integer('comprador_id').unsigned().notNullable();
    table.integer('vendedor_id').unsigned().notNullable();
    table.decimal('valor', 10, 2).notNullable();
    table.timestamp('data').defaultTo(knex.fn.now());
    table.foreign('imovel_id').references('imoveis.id').onDelete('CASCADE');
    table.foreign('comprador_id').references('usuarios.id').onDelete('CASCADE');
    table.foreign('vendedor_id').references('usuarios.id').onDelete('CASCADE');
    table.timestamps(true, true);
  });
};

export const down = function(knex) {
  return knex.schema.dropTable('transacoes');
}; 