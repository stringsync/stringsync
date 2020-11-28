import { ConfigGetter, ConfigKind, ConfigSpec } from './types';

class ConfigError extends Error {}

const toHumanReadable = (kind: ConfigKind): string => {
  switch (kind) {
    case ConfigKind.STRING:
      return 'STRING';
    case ConfigKind.INT:
      return 'INT';
    case ConfigKind.FLOAT:
      return 'FLOAT';
    default:
      return 'UNKNOWN';
  }
};

const cast = (val: string, kind: ConfigKind) => {
  switch (kind) {
    case ConfigKind.STRING:
      return val;
    case ConfigKind.INT:
      const int = parseInt(val, 10);
      if (int.toString() !== val) {
        throw new TypeError(`can't cast to INT: ${val}`);
      }
      return int;
    case ConfigKind.FLOAT:
      const float = parseFloat(val);
      if (Number.isNaN(float)) {
        throw new TypeError(`can't cast to FLOAT: ${val}`);
      }
      return float;
    default:
      throw new TypeError(`unknown ConfigKind: ${kind}`);
  }
};

export const configFactory = <S extends ConfigSpec>(spec: S): ConfigGetter<S> => (env = process.env) => {
  // any typecast is workaround to avoid indexing issue with Config<S>
  const config = {} as any;

  for (const [key, { kind, nullable }] of Object.entries(spec)) {
    const val = env[key];
    if (!val) {
      if (nullable) {
        config[key] = null;
        continue;
      } else {
        throw new ConfigError(`expected ${key} to be defined as '${toHumanReadable(kind)}', got: ${val}`);
      }
    }

    try {
      config[key] = cast(val, kind);
    } catch (e) {
      throw new ConfigError(`expected ${key} to be defined as '${toHumanReadable(kind)}', got: ${val}`);
    }
  }

  return config;
};
