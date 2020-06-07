import { createContainer, cleanupContainer } from '@stringsync/container';
import { withSessionUser } from './withSessionUser';
import { Container } from 'inversify';

let container: Container;

beforeEach(async () => {
  container = await createContainer();
});

afterEach(async () => {
  await cleanupContainer(container);
});

it('runs without crashing', () => {
  expect(() => withSessionUser(container)).not.toThrow();
});
