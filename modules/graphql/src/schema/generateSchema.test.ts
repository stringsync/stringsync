import { useTestContainer } from '@stringsync/container';
import { generateSchema } from './generateSchema';

const container = useTestContainer();

it('runs without crashing', () => {
  expect(container).toBeDefined();
  expect(container).not.toBeNull();
  expect(() => generateSchema(container)).not.toThrow();
});
