import { useTestContainer } from '@stringsync/di';
import { generateSchema } from '../schema';
import { app } from '../app';

export const useTestApp = () => {
  const container = useTestContainer();
  const schema = generateSchema();

  return { container, schema, app: app(container, schema) };
};
