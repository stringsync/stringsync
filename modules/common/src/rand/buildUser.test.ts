import { buildRandUser } from './buildRandUser';
import { randStr } from '@stringsync/common';

it('runs without crashing', () => {
  expect(buildRandUser).not.toThrow();
});

it('can accept attrs', () => {
  const username = randStr(10);
  const user = buildRandUser({ username });
  expect(user.username).toBe(username);
});
