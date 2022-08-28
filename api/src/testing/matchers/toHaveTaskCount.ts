import { matcherHint, printExpected, printReceived } from 'jest-matcher-utils';
import { Job, Payload } from '../../jobs';

export const toHaveTaskCount: jest.CustomMatcher = async <P extends Payload>(job: Job<P>, count: number) => {
  const actualCount = await job.count();
  const pass = count === actualCount;
  const message = () => {
    const msg = pass
      ? matcherHint('.not.toHaveTaskCount', 'received', 'expected')
      : matcherHint('.toHaveTaskCount', 'received', 'expected');
    return `${msg}\n\nExpected:\n\t${printExpected(count)}\nReceived:\n\t${printReceived(actualCount)}`;
  };
  return { pass, message };
};
