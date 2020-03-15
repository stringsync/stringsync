import { createQueues } from './createQueues';
import { getConfig } from '../config';

it('runs without crashing', () => {
  const config = getConfig(process.env);
  expect(() => createQueues(config)).not.toThrow();
});
