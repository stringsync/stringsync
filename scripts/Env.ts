import chalk from 'chalk';
import { log } from './util';

enum EnvType {
  String,
  Number,
  Boolean,
}

type Primitive = {
  [EnvType.String]: string;
  [EnvType.Number]: number;
  [EnvType.Boolean]: boolean;
};

export class Env<T extends EnvType> {
  static string(key: string) {
    return new Env(key, EnvType.String);
  }

  static number(key: string) {
    return new Env(key, EnvType.Number);
  }

  static boolean(key: string) {
    return new Env(key, EnvType.Boolean);
  }

  private constructor(readonly key: string, readonly type: T) {}

  get(fallback?: Primitive[T]): Primitive[T] {
    const val = process.env[this.key];

    if (typeof val === 'undefined') {
      if (typeof fallback === 'undefined') {
        throw new TypeError(`env variable is undefined and has no default: '${this.key}'`);
      }
      log(chalk.magenta(`${this.key} (default): ${fallback}`));
      return fallback;
    }

    log(chalk.magenta(`${this.key} (provided): ${val}`));

    switch (this.type) {
      case EnvType.String:
        return this.parseString(val) as Primitive[T];
      case EnvType.Number:
        return this.parseNumber(val) as Primitive[T];
      case EnvType.Boolean:
        return this.parseBoolean(val) as Primitive[T];
      default:
        throw new TypeError(`unknown EnvType: ${this.type}`);
    }
  }

  private parseString(val: string): string {
    return val;
  }

  private parseNumber(val: string): number {
    const parsed = parseInt(val);
    if (isNaN(parsed)) {
      throw new TypeError(`cannot parse value into a number: ${val}`);
    }
    return parsed;
  }

  private parseBoolean(val: string): boolean {
    if (val !== 'true' && val !== 'false') {
      throw new TypeError(`cannot parse value into a boolean: ${val}`);
    }
    return val === 'true';
  }
}
