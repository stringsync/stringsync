import { sql } from './sql';

export const findUserPageMinQuery = (): string => {
  const b = sql
    .select('notations.cursor')
    .from('notations')
    .as('cursors');
  return sql
    .min('cursors.cursor')
    .from(b)
    .toString();
};

export const findUserPageMaxQuery = (): string => {
  const b = sql
    .select('notations.cursor')
    .from('notations')
    .as('cursors');
  return sql
    .max('cursors.cursor')
    .from(b)
    .toString();
};
