import knex from 'knex';

export const sql = knex({
  client: 'pg',
});
