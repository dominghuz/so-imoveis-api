import path from 'path';
import { fileURLToPath } from 'url';
import config from './src/config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default config; 