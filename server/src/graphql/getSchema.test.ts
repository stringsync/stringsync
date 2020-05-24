import { getSchema } from './getSchema';

it('runs without crashing', () => {
  expect(getSchema).not.toThrow();
});
