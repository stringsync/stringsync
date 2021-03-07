import { Config } from '../config';
import { container } from '../inversify.config';
import { TYPES } from '../inversify.constants';
import { randStr } from '../util';
import { BullMqJob } from './bullmq';
import { Job, Processor } from './types';

const config = container.get<Config>(TYPES.Config);

type Payload = {
  message: string;
};

const messages = new Set();

beforeEach(() => {
  messages.clear();
});

const processor: Processor<Payload> = async (payload) => {
  messages.add(payload.message);
};

const isMessageProcessed = (message: string): boolean => messages.has(message);

const flush = async () => await Promise.resolve();

const bullMqJob = new BullMqJob<Payload>('FAKE_BULL_MQ_JOB', processor, config, {});

describe.each([['BullMqJob', bullMqJob]])('%s', (name: string, job: Job<Payload>) => {
  afterEach(async () => {
    await job.stop();
  });

  describe('enqueue', () => {
    it('enqueues a job', async () => {
      const message = randStr(10);
      await job.enqueue({ message });
      await flush();
      await expect(job.count()).resolves.toBe(1);
      expect(isMessageProcessed(message)).toBeFalse();
    });
  });

  describe('start', () => {
    it('runs jobs', async () => {
      const message = randStr(10);
      await job.enqueue({ message });
      await job.start();
      await flush();
      expect(isMessageProcessed(message)).toBeTrue();
    });
  });
});
