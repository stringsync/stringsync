import { randStr } from '@stringsync/common';
import { EntityBuilder } from './EntityBuilder';

describe('buildRandUser', () => {
  it('runs without crashing', () => {
    expect(EntityBuilder.buildRandUser).not.toThrow();
  });

  it('can accept attrs', () => {
    const username = randStr(10);
    const user = EntityBuilder.buildRandUser({ username });
    expect(user.username).toBe(username);
  });
});

describe('buildRandNotation', () => {
  it('runs without crashing', () => {
    expect(EntityBuilder.buildRandNotation).not.toThrow();
  });

  it('can accept attrs', () => {
    const songName = randStr(10);
    const notation = EntityBuilder.buildRandNotation({ songName });
    expect(notation.songName).toBe(songName);
  });
});

describe('buildRandTag', () => {
  it('runs without crashing', () => {
    expect(EntityBuilder.buildRandTag).not.toThrow();
  });

  it('can accept attrs', () => {
    const name = randStr(10);
    const tag = EntityBuilder.buildRandTag({ name });
    expect(tag.name).toBe(name);
  });
});

describe('buildRandTagging', () => {
  it('runs without crashing', () => {
    expect(EntityBuilder.buildRandTagging).not.toThrow();
  });

  it('can accept attrs', () => {
    const notationId = randStr(10);
    const tagging = EntityBuilder.buildRandTagging({ notationId });
    expect(tagging.notationId).toBe(notationId);
  });
});
