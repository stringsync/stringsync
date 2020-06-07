import { createContainer, cleanupContainer } from '@stringsync/container';
import { Container } from 'inversify';
import { generateSchema } from './generateSchema';

let container: Container;

beforeEach(async () => {
  container = await createContainer();
});

afterEach(async () => {
  await cleanupContainer(container);
});

it('runs without crashing', () => {
  expect(container).toBeDefined();
  expect(container).not.toBeNull();
  expect(() => generateSchema(container)).not.toThrow();
});
