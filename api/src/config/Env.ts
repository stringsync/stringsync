export enum EnvType {
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
  static string(key: string, env = process.env) {
    return new Env(key, EnvType.String, env);
  }

  static number(key: string, env = process.env) {
    return new Env(key, EnvType.Number, env);
  }

  static boolean(key: string, env = process.env) {
    return new Env(key, EnvType.Boolean, env);
  }

  private constructor(readonly key: string, readonly type: T, readonly env: Record<string, string | undefined>) {}

  get(): Primitive[T] {
    const val = this.env[this.key];
    if (typeof val === 'undefined') {
      throw new TypeError(`env variable is undefined: '${this.key}'`);
    }
    return this.parse(val);
  }

  getOrDefault(defaultVal: Primitive[T]): Primitive[T] {
    const val = this.env[this.key];

    if (typeof val === 'undefined') {
      return defaultVal;
    }

    return this.parse(val);
  }

  private parse(val: string): Primitive[T] {
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

  private parseJson(val: string): Record<string, string> {
    return JSON.parse(val);
  }
}
