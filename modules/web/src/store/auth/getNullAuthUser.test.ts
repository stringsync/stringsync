import { getNullAuthUser } from './getNullAuthUser';

it('runs without crashing', () => {
  expect(getNullAuthUser).not.toThrow();
});
