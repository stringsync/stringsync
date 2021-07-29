import { GraphQLError, GraphQLFormattedError } from 'graphql';
import { get } from 'lodash';
import { UNKNOWN_ERROR_MSG } from '../../../errors';

const getMessage = (error: GraphQLError): string => {
  const isUserFacing = !!get(error, 'isUserFacing', false);
  const message = isUserFacing ? error.message : undefined;
  return message || UNKNOWN_ERROR_MSG;
};

export const formatError = (error: GraphQLError): GraphQLFormattedError => {
  const message = getMessage(error);
  const locations = error.locations;
  const path = error.path;
  const extensions = error.extensions;

  return extensions ? { message, locations, path, extensions } : { message, locations, path };
};
