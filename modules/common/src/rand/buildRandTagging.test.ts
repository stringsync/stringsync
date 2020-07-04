import { buildRandTagging } from './buildRandTagging';
import { randStr } from './randStr';

it('runs without crashing', () => {
  expect(buildRandTagging).not.toThrow();
});

it('can accept attrs', () => {
  const notationId = randStr(10);
  const tagging = buildRandTagging({ notationId });
  expect(tagging.notationId).toBe(notationId);
});
