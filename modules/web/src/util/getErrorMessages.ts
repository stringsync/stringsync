interface GraphQLError {
  graphQLErrors: Array<{ message: string }>;
}

const getGraphqlErrorMessages = (error: GraphQLError): string[] => {
  const errorMessages = [];
  for (const graphQLError of error.graphQLErrors) {
    errorMessages.push(graphQLError.message);
  }
  return errorMessages;
};

export const getErrorMessages = (error: any): string[] => {
  if ('graphQLErrors' in error) {
    return getGraphqlErrorMessages(error);
  } else {
    return ['something went wrong'];
  }
};
