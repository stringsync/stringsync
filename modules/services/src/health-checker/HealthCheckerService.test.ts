import { HealthCheckerService } from './HealthCheckerService';
import { createContainer, cleanupContainer, TYPES } from '@stringsync/container';
import { Container } from 'inversify';

let healthCheckerService: HealthCheckerService;
let container: Container;

beforeEach(async () => {
  container = await createContainer();
  healthCheckerService = container.get<HealthCheckerService>(TYPES.HealthCheckerService);
});

afterEach(async () => {
  await cleanupContainer(container);
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
