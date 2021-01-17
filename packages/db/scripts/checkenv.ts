import { DB_CONFIG } from '../src/DB_CONFIG';

const config = DB_CONFIG();
console.log(`DB config verified, running in NODE_ENV='${config.NODE_ENV}'`);
