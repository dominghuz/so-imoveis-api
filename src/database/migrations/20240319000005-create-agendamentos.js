export const up = function(knex) {
  console.log('Criando tabela agendamentos...');
  return knex.schema.createTable('agendamentos', table => {
    console.log('Definindo colunas...');
    
    table.increments('id').primary();
    table.integer('imovel_id').unsigned().notNullable();
    table.integer('cliente_id').unsigned().notNullable();
    table.integer('corretor_id').unsigned().notNullable();
    table.date('data').notNullable();
    table.time('hora').notNullable();
    table.enu('status', ['pendente', 'confirmado', 'cancelado', 'realizado'])
      .notNullable()
      .defaultTo('pendente');
    table.text('observacoes');
    table.timestamps(true, true);

    table.foreign('imovel_id').references('imoveis.id');
    table.foreign('cliente_id').references('usuarios.id');
    table.foreign('corretor_id').references('usuarios.id');
  
    
    console.log('Colunas definidas com sucesso!');
  }).then(() => {
    console.log('Tabela agendamentos criada com sucesso!');
  });
};

export const down = function(knex) {
  return knex.schema.dropTable('agendamentos');
}; 