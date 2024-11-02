import knex from 'knex';
import config from '../config/database.js';

const connection = knex(config.development);

export default connection; 