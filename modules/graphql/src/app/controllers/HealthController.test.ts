import { useTestContainer, TYPES } from '@stringsync/di';
import { HealthController } from './HealthController';

const container = useTestContainer();
let healthController: HealthController;

beforeEach(() => {
  healthController = container.get<HealthController>(TYPES.HealthController);
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
