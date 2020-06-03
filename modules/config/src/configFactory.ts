import { ConfigKind, ConfigSpec, Config } from './types';

const cast = (val: string, kind: ConfigKind) => {
  switch (kind) {
    case ConfigKind.STRING:
      return val;
    case ConfigKind.INT:
      return parseInt(val, 10);
    case ConfigKind.FLOAT:
      return parseFloat(val);
    default:
      throw new TypeError(`unknown ConfigKind: ${kind}`);
  }
};

export const configFactory = <S extends ConfigSpec>(spec: S) => (env = process.env): Config<S> => {
  // any typecast is workaround to avoid indexing issue with Config<S>
  const config = {} as any;

  for (const [key, kind] of Object.entries(spec)) {
    const val = env[key];
    if (!val) {
      throw new Error(`expected ${key} to be defined as ${kind}, got: ${val}`);
    }

    try {
      config[key] = cast(val, kind);
    } catch (e) {
      throw new Error(`expected ${key} to be defined as ${kind}, got: ${val}`);
    }
  }

  return config as Config<S>;
};
