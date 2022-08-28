import { matcherHint, printExpected, printReceived } from 'jest-matcher-utils';
import { Job, Payload, Task } from '../../jobs';
import { DeepPartial, overlaps } from '../../util';

const message = (pass: boolean, tasks: Task<Payload>[], expected: DeepPartial<Payload>) => () => {
  const msg = pass
    ? matcherHint('.not.toHaveTaskWithPayload', 'received', 'expected')
    : matcherHint('.toHaveTaskWithPayload', 'received', 'expected');
  return `${msg}\n\nExpected payload:\n\t${printExpected(expected)}\nReceived payloads:\n\t${printReceived(tasks)}`;
};

export const toHaveTaskWithPayload: jest.CustomMatcher = async <P extends Payload>(
  job: Job<P>,
  payload: DeepPartial<P>
) => {
  const tasks = await job.getTasks();
  const pass = tasks.some((task) => overlaps(task.payload, payload));
  return { pass, message: message(pass, tasks, payload) };
};
