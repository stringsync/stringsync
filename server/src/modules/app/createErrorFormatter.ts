import { ErrorFormatter } from '../app/createApolloServer';
import { get } from 'lodash';

export const createErrorFormatter = (env: string): ErrorFormatter => (e) => {
  if (env !== 'production') {
    return e;
  }

  if (get(e, 'extensions.code') === 'INTERNAL_SERVER_ERROR') {
    return { message: 'something went wrong' };
  }

  // If not an internal server error, we probably should
  // forward it to the client and let it handle it
  return e;
};
