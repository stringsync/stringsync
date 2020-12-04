import { getDbConfig } from '@stringsync/config';

const config = getDbConfig();
console.log(`DB config verified, running in NODE_ENV='${config.NODE_ENV}'`);
