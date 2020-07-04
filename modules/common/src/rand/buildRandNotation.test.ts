import { buildRandNotation } from './buildRandNotation';
import { randStr } from '@stringsync/common';

it('runs without crashing', () => {
  expect(buildRandNotation).not.toThrow();
});

it('can accept attrs', () => {
  const songName = randStr(10);
  const notation = buildRandNotation({ songName });
  expect(notation.songName).toBe(songName);
});
