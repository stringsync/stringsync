import { matcherHint, printExpected } from 'jest-matcher-utils';
import { isEqual } from 'lodash';
import { Job, Payload, Task } from '../../jobs';

const toString = (task: Task<Payload>) => JSON.stringify(task, null, 2);

const message = (pass: boolean, task: Task<Payload>) => () => {
  const msg = pass
    ? matcherHint('.not.toHaveTask', 'received', toString(task))
    : matcherHint('.toHaveTask', 'received', toString(task));
  return `${msg}\n\nExpected:\n\t${printExpected(toString(task))}`;
};

export const toHaveTask: jest.CustomMatcher = async <P extends Payload>(job: Job<P>, expected: Task<P>) => {
  const tasks = await job.getTasks();
  const pass = tasks.some((task) => isEqual(task, expected));
  return { pass, message: message(pass, expected) };
};
