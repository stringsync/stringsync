import { HealthCheckerService } from './HealthCheckerService';
import { useTestContainer, TYPES } from '@stringsync/di';

const container = useTestContainer();

let healthCheckerService: HealthCheckerService;

beforeEach(() => {
  healthCheckerService = container.get<HealthCheckerService>(TYPES.HealthCheckerService);
});

describe('checkHealth', () => {
  it('authenticates the db connection', async () => {
    const spy = jest.spyOn(healthCheckerService.sequelize, 'authenticate');

    await healthCheckerService.checkHealth();

    expect(spy).toBeCalledTimes(1);
  });

  it('checks the time on the redis connection', async () => {
    const spy = jest.spyOn(healthCheckerService.redis, 'time');

    await healthCheckerService.checkHealth();

    expect(spy).toBeCalledTimes(1);
  });
});
