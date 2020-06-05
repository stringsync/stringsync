import { getApp } from './getApp';

it('runs without crashing', () => {
  expect(getApp).not.toThrow();
});
