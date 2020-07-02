import { DI } from './DI';

export const useTestContainer = () => {
  const container = DI.create();

  afterEach(async () => {
    await DI.cleanup(container);
  });

  afterAll(async () => {
    await DI.teardown(container);
  });

  return container;
};
