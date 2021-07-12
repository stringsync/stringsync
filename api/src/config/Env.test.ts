import { Env } from './Env';

const ENV = Object.freeze({
  STRING: 'STRING',
  NUMBER: '42',
  BOOLEAN: 'true',
});

describe('Env', () => {
  describe('string', () => {
    it('interprets string env vars', () => {
      const val = Env.string('STRING', ENV).get();
      expect(val).toBe('STRING');
    });

    it('interprets numbers as strings', () => {
      const val = Env.string('NUMBER', ENV).get();
      expect(val).toBe('42');
    });

    it('interprets booleans as strings', () => {
      const val = Env.string('BOOLEAN', ENV).get();
      expect(val).toBe('true');
    });
  });

  describe('number', () => {
    it('interprets number env vars', () => {
      const val = Env.number('NUMBER', ENV).get();
      expect(val).toBe(42);
    });

    it.each(['STRING', 'BOOLEAN'])('throws errors for %s', (key) => {
      expect(() => {
        Env.number(key, ENV).get();
      }).toThrow();
    });
  });

  describe('boolean', () => {
    it('interprets boolean env vars', () => {
      const val = Env.boolean('BOOLEAN', ENV).get();
      expect(val).toBeTrue();
    });

    it.each(['STRING', 'NUMBER', 'JSON'])('throws errors for %s', (key) => {
      expect(() => {
        Env.boolean(key, ENV).get();
      }).toThrow();
    });
  });

  describe('get', () => {
    it('returns a defined env var', () => {
      const val = Env.string('STRING', ENV).get();
      expect(val).toBe('STRING');
    });

    it('throws an error for undefined env vars', () => {
      expect(() => {
        Env.string('FOO', ENV).get();
      }).toThrow();
    });
  });

  describe('getOrDefault', () => {
    it('returns a defined env var', () => {
      const val = Env.string('STRING', ENV).get();
      expect(val).toBe('STRING');
    });

    it('returns the fallback for undefined env vars', () => {
      const val = Env.string('FOO', ENV).getOrDefault('BAR');
      expect(val).toBe('BAR');
    });
  });
});
