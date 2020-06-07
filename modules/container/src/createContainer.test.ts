import { createContainer } from './createContainer';
import { Container } from 'inversify';
import { cleanupContainer } from './cleanupContainer';

let container: Container;

afterEach(async () => {
  await cleanupContainer(container);
});

it('runs without crashing', async () => {
  const fn = async () => {
    container = await createContainer();
  };
  await expect(fn()).resolves.not.toThrow();
});
