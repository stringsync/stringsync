import { useTestContainer } from '@stringsync/di';
import { API } from '../../API';
import { API_TYPES } from '../../API_TYPES';
import { HealthController } from './HealthController';

const TYPES = { ...API_TYPES };

describe('HealthController', () => {
  const ref = useTestContainer(API);

  let healthController: HealthController;

  beforeEach(() => {
    healthController = ref.container.get<HealthController>(TYPES.HealthController);
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
});
