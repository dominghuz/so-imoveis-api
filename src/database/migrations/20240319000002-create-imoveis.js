export const up = function(knex) {
  return knex.schema.createTable('imoveis', table => {
    table.increments('id').primary(); 
    table.string('tipo', 50).notNullable();
    table.string('titulo', 200).notNullable();
    table.enu('finalidade', ['venda', 'aluguel']).notNullable();
    table.decimal('preco', 12, 2).notNullable().checkPositive();
    table.string('cidade', 100).notNullable();
    table.string('bairro', 100).notNullable();
    table.string('endereco', 200).notNullable();
    table.string('numero', 20);
    table.string('complemento', 100);
    table.string('cep', 8).notNullable();
    table.decimal('area', 8, 2).notNullable().checkPositive();
    table.integer('vagas').notNullable().unsigned();
    table.integer('quartos').notNullable().unsigned();
    table.integer('banheiros').notNullable().unsigned();
    table.text('descricao');
    table.enu('status', ['disponivel', 'vendido', 'alugado', 'reservado'])
      .notNullable()
      .defaultTo('disponivel');
    table.boolean('destaque').notNullable().defaultTo(false);
    table.string('imagem', 255).notNullable();
    table.integer('corretor_id').unsigned()
      .references('id')
      .inTable('usuarios')
      .onDelete('SET NULL');
    table.timestamps(true, true);
  });
};

export const down = function(knex) {
  return knex.schema.dropTable('imoveis');
}; 