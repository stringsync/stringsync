import { Container, useTestContainer } from '@stringsync/di';
import { SERVICES } from '../SERVICES';
import { SERVICES_TYPES } from '../SERVICES_TYPES';
import { HealthCheckerService } from './HealthCheckerService';

const TYPES = { ...SERVICES_TYPES };

const ref = useTestContainer(SERVICES);

let container: Container;

let healthCheckerService: HealthCheckerService;

beforeEach(() => {
  container = ref.container;
});

beforeEach(() => {
  healthCheckerService = container.get<HealthCheckerService>(TYPES.HealthCheckerService);
});

describe('checkHealth', () => {
  it('checks on the db health', async () => {
    const spy = jest.spyOn(healthCheckerService.db, 'checkHealth');

    await healthCheckerService.checkHealth();

    expect(spy).toBeCalledTimes(1);
  });

  it('checks on the cache health', async () => {
    const spy = jest.spyOn(healthCheckerService.cache, 'checkHealth');

    await healthCheckerService.checkHealth();

    expect(spy).toBeCalledTimes(1);
  });
});
