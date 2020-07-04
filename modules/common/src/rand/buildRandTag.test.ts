import { randStr } from './randStr';
import { buildRandTag } from './buildRandTag';

it('runs without crashing', () => {
  expect(buildRandTag).not.toThrow();
});

it('can accept attrs', () => {
  const name = randStr(10);
  const tag = buildRandTag({ name });
  expect(tag.name).toBe(name);
});
