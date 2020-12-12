import { createContainer } from './createContainer';
import { Pkg, TestContainerRef } from './types';

export const useTestContainer = (pkg: Pkg): TestContainerRef => {
  const ref: Partial<TestContainerRef> = {};

  beforeEach(async () => {
    const { container, setup, cleanup, teardown } = await createContainer(pkg);
    ref.container = container;
    ref.setup = setup;
    ref.cleanup = cleanup;
    ref.teardown = teardown;
  });

  beforeEach(async () => {
    if (ref.setup && ref.container) {
      await ref.setup(ref.container);
    }
  });

  afterEach(async () => {
    if (ref.cleanup && ref.container) {
      await ref.cleanup(ref.container);
    }
  });

  afterAll(async () => {
    if (ref.teardown && ref.container) {
      await ref.teardown(ref.container);
    }
  });

  return ref as TestContainerRef;
};
