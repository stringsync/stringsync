import { container } from '../../inversify.config';
import { TYPES } from '../../inversify.constants';
import { HealthCheckerService } from './HealthCheckerService';

describe('HealthCheckerService', () => {
  let healthCheckerService: HealthCheckerService;

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
});
