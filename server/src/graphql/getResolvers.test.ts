import { getResolvers } from './getResolvers';

it('runs without crashing', () => {
  expect(getResolvers).not.toThrow();
});
