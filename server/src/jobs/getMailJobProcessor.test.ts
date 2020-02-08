import { getMailJobProcessor } from './getMailJobProcessor';
import { getLogger } from '../util';

it('runs without crashing', () => {
  const logger = getLogger();
  expect(() => getMailJobProcessor(logger)).not.toThrow();
});
