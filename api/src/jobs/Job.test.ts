import { Config } from '../config';
import { container } from '../inversify.config';
import { TYPES } from '../inversify.constants';
import { BullMqJob } from './bullmq';
import { Job, Processor } from './types';

type Payload = { id: number };

const createBullMqJob = (name: string, process: Processor<Payload>, config: Config) => {
  return new BullMqJob(name, process, config, {});
};

describe.each([['BullMqJob', createBullMqJob]])('%s', (name, createJob) => {
  let job: Job<Payload>;
  let process: Processor<Payload>;

  beforeEach(() => {
    const config = container.get<Config>(TYPES.Config);
    process = jest.fn();
    job = createJob(`${name}-test`, process, config);
  });

  describe('count', () => {
    it('returns zero when there are no jobs', async () => {
      await expect(job.count()).resolves.toBe(0);
    });

    it('returns how many jobs are in queue', async () => {
      await Promise.all([job.enqueue({ id: 1 }), job.enqueue({ id: 2 })]);
      const count = await job.count();
      expect(count).toBe(2);
    });
  });

  describe('isHealthy', () => {
    it('returns false when it is not running', async () => {
      await expect(job.isHealthy()).resolves.toBeFalse();
    });

    it('returns true when it is running', async () => {
      await job.startWorking();
      await expect(job.isHealthy()).resolves.toBeTrue();
    });
  });

  describe('getTasks', () => {
    it('returns all tasks', async () => {
      const payload1 = { id: 1 };
      const payload2 = { id: 2 };
      await Promise.all([job.enqueue(payload1), job.enqueue(payload2)]);

      const tasks = await job.getTasks();

      expect(tasks).toIncludeAllMembers([{ payload: payload1 }, { payload: payload2 }]);
    });
  });
});
