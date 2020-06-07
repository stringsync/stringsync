import { createContainer, cleanupContainer, TYPES } from '@stringsync/container';
import { HealthController } from './HealthController';
import { Container } from 'inversify';

let container: Container;
let healthController: HealthController;

beforeEach(async () => {
  container = await createContainer();
  healthController = container.get<HealthController>(TYPES.HealthController);
});

afterEach(async () => {
  await cleanupContainer(container);
});

describe('get', () => {
  it('runs without crashing', async () => {
    const checkHealth = jest.spyOn(healthController.healthCheckerService, 'checkHealth').mockResolvedValue();
    const req = {} as any;
    const send = jest.fn();
    const res = { send } as any;
    const next = jest.fn();

    await healthController.get(req, res, next);

    expect(checkHealth).toHaveBeenCalledTimes(1);
    expect(send).toHaveBeenCalledTimes(1);
  });
});
