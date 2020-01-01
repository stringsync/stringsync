import { createApolloClient } from './createApolloClient';

it('runs without crashing', () => {
  expect(createApolloClient).not.toThrow();
});
