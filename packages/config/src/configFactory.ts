import { ConfigGetter, ConfigKind, ConfigMapping } from './types';

class ConfigError extends Error {
  constructor(messages: string[]) {
    super(messages.join('\n'));
  }
}

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

export const configFactory = <M extends ConfigMapping>(mapping: M): ConfigGetter<M> => (env = process.env) => {
  // any typecast is workaround to avoid indexing issue with Config<S>
  const config = {} as any;
  const messages = new Array<string>();

  for (const [key, { kind, nullable }] of Object.entries(mapping)) {
    const val = env[key];
    if (typeof val === 'undefined') {
      if (nullable) {
        config[key] = null;
      } else {
        messages.push(`expected ${key} to be defined as '${toHumanReadable(kind)}', got: ${val}`);
      }
      continue;
    }

    try {
      config[key] = cast(val, kind);
    } catch (e) {
      messages.push(`expected ${key} to be defined as '${toHumanReadable(kind)}', got: ${val}`);
    }
  }

  if (messages.length > 0) {
    throw new ConfigError(messages);
  }

  return config;
};
