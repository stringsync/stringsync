import { randStr } from './randStr';
import { TestFactory } from './TestFactory';

describe('buildRandUser', () => {
  it('runs without crashing', () => {
    expect(TestFactory.buildRandUser).not.toThrow();
  });

  it('can accept attrs', () => {
    const username = randStr(10);
    const user = TestFactory.buildRandUser({ username });
    expect(user.username).toBe(username);
  });
});

describe('buildRandNotation', () => {
  it('runs without crashing', () => {
    expect(TestFactory.buildRandNotation).not.toThrow();
  });

  it('can accept attrs', () => {
    const songName = randStr(10);
    const notation = TestFactory.buildRandNotation({ songName });
    expect(notation.songName).toBe(songName);
  });
});

describe('buildRandTag', () => {
  it('runs without crashing', () => {
    expect(TestFactory.buildRandTag).not.toThrow();
  });

  it('can accept attrs', () => {
    const name = randStr(10);
    const tag = TestFactory.buildRandTag({ name });
    expect(tag.name).toBe(name);
  });
});

describe('buildRandTagging', () => {
  it('runs without crashing', () => {
    expect(TestFactory.buildRandTagging).not.toThrow();
  });

  it('can accept attrs', () => {
    const notationId = randStr(10);
    const tagging = TestFactory.buildRandTagging({ notationId });
    expect(tagging.notationId).toBe(notationId);
  });
});
