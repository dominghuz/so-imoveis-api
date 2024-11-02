import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  development: {
    client: 'sqlite3',
    connection: {
      filename: path.resolve(__dirname, '..', 'database', 'db.sqlite')
    },
    migrations: {
      directory: path.resolve(__dirname, '..', 'database', 'migrations')
    },
    seeds: {
      directory: path.resolve(__dirname, '..', 'database', 'seeds')
    },
    useNullAsDefault: true
  }
}; 