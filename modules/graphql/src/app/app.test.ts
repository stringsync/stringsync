import { app } from './app';
import { useTestContainer } from '@stringsync/container';

const container = useTestContainer();

it('runs without crashing', () => {
  expect(() => app(container)).not.toThrow();
});
