import { createContainer, cleanupContainer } from '@stringsync/container';
import { withSession } from './withSession';
import { Container } from 'inversify';

let container: Container;

beforeEach(async () => {
  container = await createContainer();
});

afterEach(async () => {
  await cleanupContainer(container);
});

it('runs without crashing', () => {
  expect(() => withSession(container)).not.toThrow();
});
