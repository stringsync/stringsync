import { createContainer, cleanupContainer } from '@stringsync/container';
import { withGraphQL } from './withGraphQL';
import { Container } from 'inversify';
import { generateSchema } from '../../schema';

let container: Container;

beforeEach(async () => {
  container = await createContainer();
});

afterEach(async () => {
  await cleanupContainer(container);
});

it('runs without crashing', () => {
  const schema = generateSchema(container);
  expect(() => withGraphQL(container, schema)).not.toThrow();
});
