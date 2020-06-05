import { HealthCheckerService } from './HealthCheckerService';
import { Container, TYPES } from '@stringsync/container';

let healthCheckerService: HealthCheckerService;

beforeEach(() => {
  healthCheckerService = Container.instance.get<HealthCheckerService>(TYPES.HealthCheckerService);
});

describe('checkHealth', () => {
  it('authenticates the db connection', async () => {
    const spy = jest.spyOn(healthCheckerService.db.sequelize, 'authenticate');

    await healthCheckerService.checkHealth();

    expect(spy).toBeCalledTimes(1);
  });

  it('checks the time on the redis connection', async () => {
    const spy = jest.spyOn(healthCheckerService.redis, 'time');

    await healthCheckerService.checkHealth();

    expect(spy).toBeCalledTimes(1);
  });
});
