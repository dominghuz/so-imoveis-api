export const up = function(knex) {
  console.log('Criando tabela contratos...');
  return knex.schema.createTable('contratos', table => {
    console.log('Definindo colunas...');
    
    // Chaves e relacionamentos
    table.increments('id').primary();
    table.integer('imovel_id').unsigned().notNullable();
    table.integer('cliente_id').unsigned().notNullable();
    table.integer('corretor_id').unsigned().notNullable();
    
    // Dados do contrato
    table.enu('tipo', ['venda', 'aluguel']).notNullable();
    table.decimal('valor', 12, 2).notNullable();
    table.date('data_inicio').notNullable();
    table.date('data_fim');
    table.enu('status', ['pendente', 'assinado', 'cancelado', 'finalizado'])
      .notNullable()
      .defaultTo('pendente');
    
    // Dados adicionais
    table.text('observacoes');
    table.string('arquivo_url');
    
    // Timestamps
    table.timestamps(true, true);

    // Chaves estrangeiras
    table.foreign('imovel_id').references('imoveis.id')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');
    table.foreign('cliente_id').references('usuarios.id')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');
    table.foreign('corretor_id').references('usuarios.id')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');
    
    console.log('Colunas definidas com sucesso!');
  }).then(() => {
    console.log('Tabela contratos criada com sucesso!');
  });
};

export const down = function(knex) {
  return knex.schema.dropTable('contratos');
}; 