import { GraphQLError, GraphQLFormattedError } from 'graphql';
import { get } from 'lodash';
import { UNKNOWN_ERROR_MSG, ValidationError } from '../../../errors';
import { Logger } from '../../../util';

const getMessage = (error: GraphQLError): string => {
  const originalError = error.originalError;
  if (!originalError) {
    return UNKNOWN_ERROR_MSG;
  }

  if (originalError instanceof ValidationError) {
    return originalError.details.join('; ');
  }

  const isUserFacing = !!get(originalError, 'isUserFacing', false);
  if (isUserFacing) {
    return originalError.message;
  }

  return UNKNOWN_ERROR_MSG;
};

export const formatError = (logger: Logger) => (error: GraphQLError): GraphQLFormattedError => {
  console.error(error);
  const message = getMessage(error);
  const locations = error.locations;
  const path = error.path;
  const extensions = error.extensions;

  return extensions ? { message, locations, path, extensions } : { message, locations, path };
};
