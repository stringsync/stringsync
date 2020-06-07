import { createContainer } from './createContainer';
import { getContainerConfig } from '@stringsync/config';
import { Container } from 'inversify';
import { cleanupContainer } from './cleanupContainer';

let container: Container | undefined;

afterEach(async () => {
  if (container) {
    cleanupContainer(container);
  }
  container = undefined;
});

it('runs without crashing', async () => {
  const fn = async () => {
    container = await createContainer();
  };
  await expect(fn()).resolves.not.toThrow();
});
