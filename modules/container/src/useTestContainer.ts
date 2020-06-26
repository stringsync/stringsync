import { Ioc } from './Ioc';

export const useTestContainer = () => {
  const container = Ioc.create();

  afterEach(async () => {
    await Ioc.cleanup(container);
  });

  afterAll(async () => {
    await Ioc.teardown(container);
  });

  return container;
};
