import { DB_CONFIG } from '../src/config';

const config = DB_CONFIG();
console.log(`DB config verified, running in NODE_ENV='${config.NODE_ENV}'`);
