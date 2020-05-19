import { get } from 'lodash';
import { GraphQLError } from 'graphql';

const shouldSanitizeError = (env: string, e: GraphQLError) => {
  const isProduction = env === 'production';
  const isInternalError = get(e, 'extensions.code') === 'INTERNAL_SERVER_ERROR';
  return isProduction && isInternalError;
};

export const getErrorFormatter = (env: string) => (e: GraphQLError) => {
  if (shouldSanitizeError(env, e)) {
    return { message: 'something went wrong' };
  }
  return e;
};
