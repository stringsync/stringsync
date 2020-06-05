import { userFactory } from './userFactory';
import { randStr } from '@stringsync/common';

it('runs without crashing', () => {
  expect(userFactory).not.toThrow();
});

it('can accept attrs', () => {
  const username = randStr(10);
  const user = userFactory({ username });
  expect(user.username).toBe(username);
});
