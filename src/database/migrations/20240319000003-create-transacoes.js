export const up = function(knex) {
  console.log('Criando tabela transacoes...');
  return knex.schema.createTable('transacoes', table => {
    table.increments('id').primary();
    table.integer('imovel_id').unsigned().notNullable()
      .references('id')
      .inTable('imoveis')
      .onDelete('CASCADE');
    
    table.integer('cliente_id').unsigned().notNullable()
      .references('id')
      .inTable('usuarios')
      .onDelete('CASCADE');
    
    table.integer('corretor_id').unsigned().notNullable()
      .references('id')
      .inTable('usuarios')
      .onDelete('CASCADE');
    
    table.enu('tipo', ['venda', 'aluguel']).notNullable();
    table.decimal('valor', 12, 2).notNullable();
    
    table.enu('status', ['pendente', 'concluido', 'cancelado'])
      .notNullable()
      .defaultTo('pendente');
    
    table.date('data_inicio').notNullable();
    table.date('data_fim');
    table.text('contrato_url');
    
    table.timestamps(true, true);
  }).then(() => {
    console.log('Tabela transacoes criada com sucesso!');
  });
};

export const down = function(knex) {
  return knex.schema.dropTable('transacoes');
}; 