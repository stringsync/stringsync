import * as rand from './rand';

describe('rand', () => {
  describe('str', () => {
    it('returns a random string of given length', () => {
      const str = rand.str(4);
      expect(str).toBeString();
      expect(str).toHaveLength(4);
    });
  });

  describe('int', () => {
    it('returns a random int between min and max', () => {
      const int = rand.int(0, 10);
      expect(int).toBeNumber();
      expect(int).toBeGreaterThanOrEqual(0);
      expect(int).toBeLessThanOrEqual(10);
    });
  });

  describe('user', () => {
    it('returns a random user', () => {
      const user = rand.user();
      expect(user).toBeObject();
    });
  });

  describe('notation', () => {
    it('returns a random notation', () => {
      const notation = rand.notation();
      expect(notation).toBeObject();
    });
  });

  describe('tag', () => {
    it('returns a random tag', () => {
      const tag = rand.tag();
      expect(tag).toBeObject();
    });
  });
});
