import knex from 'knex';
import config from '../config/database.js';

const connection = knex(config.development);

async function migrate() {
  try {
    console.log('Executando migrations...');
    await connection.migrate.latest();
    console.log('Migrations executadas com sucesso!');

    console.log('Executando seeds...');
    await connection.seed.run();
    console.log('Seeds executadas com sucesso!');
  } catch (error) {
    console.error('Erro ao executar migrations/seeds:', error);
  } finally {
    await connection.destroy();
  }
}

migrate(); 