import { buildUser } from './userFactory';
import { randStr } from '@stringsync/common';

it('runs without crashing', () => {
  expect(buildUser).not.toThrow();
});

it('can accept attrs', () => {
  const username = randStr(10);
  const user = buildUser({ username });
  expect(user.username).toBe(username);
});
