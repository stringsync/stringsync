import { GraphQLError, GraphQLFormattedError } from 'graphql';
import { get } from 'lodash';
import { UNKNOWN_ERROR_MSG } from '@stringsync/common';

const getMessage = (error: GraphQLError): string => {
  if (get(error.originalError, 'name') === 'SequelizeUniqueConstraintError') {
    return get(error.originalError, 'errors[0].message', UNKNOWN_ERROR_MSG);
  }
  return error.message || UNKNOWN_ERROR_MSG;
};

export const formatError = (error: GraphQLError): GraphQLFormattedError => {
  const message = getMessage(error);
  const locations = error.locations;
  const path = error.path;
  const extensions = error.extensions;

  return extensions ? { message, locations, path, extensions } : { message, locations, path };
};
