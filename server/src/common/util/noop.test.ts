import { noop } from './noop';

it('runs without crashing', () => {
  expect(noop).not.toThrow();
});
