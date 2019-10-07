const getErrorMessages = (error: any): string[] => {
  const errorMessages = [];
  if ('graphQLErrors' in error) {
    for (const graphQLError of error.graphQLErrors) {
      errorMessages.push(graphQLError.message);
    }
  } else {
    console.error(error);
    errorMessages.push('something went wrong');
  }
  return errorMessages;
};

export default getErrorMessages;
