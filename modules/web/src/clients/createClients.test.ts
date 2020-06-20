import { createClients } from './createClients';

it('runs without crashing', () => {
  expect(createClients).not.toThrow();
});
