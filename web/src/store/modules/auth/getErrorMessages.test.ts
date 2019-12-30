import { getErrorMessages } from './getErrorMessages';

it('gets error messages from graphQL errors', () => {
  const error = {
    graphQLErrors: [{ message: 'message1' }, { message: 'message2' }],
  };

  const errorMessages = getErrorMessages(error);

  expect(errorMessages).toEqual(['message1', 'message2']);
});

it('masks non-graphQL errors', () => {
  const error = new Error('error message that might confused the user');

  const errorMessages = getErrorMessages(error);

  expect(errorMessages).toEqual(['something went wrong']);
});
