import { configFactory } from './configFactory';
import { ConfigGetter, ConfigKind } from './types';

describe('configFactory', () => {
  describe('when STRING value', () => {
    let getConfig: ConfigGetter<{ ENV_VAR: { kind: ConfigKind.STRING; nullable: false } }>;

    beforeEach(() => {
      getConfig = configFactory({ ENV_VAR: { kind: ConfigKind.STRING, nullable: false } });
    });

    it.each(['helloworld', '123', '456.789'])('parses', (val) => {
      const env = { ENV_VAR: val };
      const config = getConfig(env);
      expect(config.ENV_VAR).toBe(val);
    });

    it('throws when falsy', () => {
      const env = { ENV_VAR: undefined };
      expect(() => getConfig(env)).toThrow();
    });
  });

  describe('when INT value', () => {
    let getConfig: ConfigGetter<{ ENV_VAR: { kind: ConfigKind.INT; nullable: false } }>;

    beforeEach(() => {
      getConfig = configFactory({ ENV_VAR: { kind: ConfigKind.INT, nullable: false } });
    });

    it.each([
      { val: '123', expected: 123 },
      { val: '0', expected: 0 },
      { val: '-1', expected: -1 },
    ])('parses INT values', (t) => {
      const env = { ENV_VAR: t.val };
      const config = getConfig(env);
      expect(config.ENV_VAR).toBe(t.expected);
    });

    it.each(['1.4', '3.999999999', 'foo', '1e3', '2i + 3'])('throws when invalid INT value', (val) => {
      const env = { ENV_VAR: val };
      expect(() => getConfig(env)).toThrow();
    });
  });

  describe('when FLOAT value', () => {
    let getConfig: ConfigGetter<{ ENV_VAR: { kind: ConfigKind.FLOAT; nullable: false } }>;

    beforeEach(() => {
      getConfig = configFactory({ ENV_VAR: { kind: ConfigKind.FLOAT, nullable: false } });
    });

    it.each([
      { val: '1.2', expected: 1.2 },
      { val: '3.12345', expected: 3.12345 },
      { val: '2', expected: 2 },
      { val: '1.000', expected: 1 },
      { val: '1.2e4', expected: 1.2e4 },
      { val: '2i + 4', expected: 2 },
      { val: '12sadsad3f3', expected: 12 },
    ])('parses FLOAT values', (t) => {
      const env = { ENV_VAR: t.val };
      const config = getConfig(env);
      expect(config.ENV_VAR).toBe(t.expected);
    });

    it.each(['foo', 'd12aex'])('throws when invalid FLOAT value', (val) => {
      const env = { ENV_VAR: val };
      expect(() => getConfig(env)).toThrow();
    });
  });

  it.each([ConfigKind.STRING, ConfigKind.INT, ConfigKind.FLOAT])('throws when val is undefined', (kind) => {
    const getConfig = configFactory({ ENV_VAR: { kind, nullable: false } });
    const env = {};
    expect(() => getConfig(env)).toThrow();
  });
});
