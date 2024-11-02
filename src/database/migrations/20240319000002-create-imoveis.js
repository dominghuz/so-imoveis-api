export const up = function(knex) {
  console.log('Criando tabela imoveis...');
  return knex.schema.createTable('imoveis', table => {
    console.log('Definindo colunas...');
    table.increments('id').primary();
    table.string('tipo').notNullable();
    table.enu('finalidade', ['venda', 'aluguel']).notNullable();
    table.decimal('preco', 12, 2).notNullable();
    table.string('cidade').notNullable();
    table.string('bairro').notNullable();
    table.string('rua').notNullable();
    table.string('numero');
    table.string('complemento');
    table.decimal('metragem', 8, 2).notNullable();
    table.integer('vagas').notNullable();
    table.integer('quartos').notNullable();
    table.integer('banheiros').notNullable();
    table.text('descricao');
    table.enu('status', ['disponivel', 'vendido', 'alugado', 'reservado'])
      .notNullable()
      .defaultTo('disponivel');
    table.boolean('destaque').defaultTo(false);
    table.string('imagem').notNullable();
    table.integer('corretor_id').unsigned()
      .references('id')
      .inTable('usuarios')
      .onDelete('SET NULL');
    table.timestamps(true, true);
    console.log('Colunas definidas com sucesso!');
  }).then(() => {
    console.log('Tabela imoveis criada com sucesso!');
  });
};

export const down = function(knex) {
  return knex.schema.dropTable('imoveis');
}; 