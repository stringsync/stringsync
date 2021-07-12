export enum EnvType {
  String,
  Number,
  Boolean,
  Json,
}

type Primitive = {
  [EnvType.String]: string;
  [EnvType.Number]: number;
  [EnvType.Boolean]: boolean;
  [EnvType.Json]: Record<string, string>;
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

  static json(key: string) {
    return new Env(key, EnvType.Json);
  }

  private constructor(readonly key: string, readonly type: T) {}

  get(): Primitive[T] {
    const val = process.env[this.key];
    if (typeof val === 'undefined') {
      throw new TypeError(`env variable is undefined: '${this.key}'`);
    }
    return this.parse(val, this.type);
  }

  getJson(jsonKey: string, envType: EnvType): Primitive[typeof envType] {
    if (this.type !== EnvType.Json) {
      throw new TypeError(`env variable is not JSON: ${this.key}`);
    }

    const val = process.env[this.key];
    if (typeof val === 'undefined') {
      throw new TypeError(`env variable is undefined: '${this.key}'`);
    }

    const json = this.parse(val, EnvType.Json) as Record<string, string>;
    const jsonVal = json[jsonKey];
    if (typeof jsonVal === 'undefined') {
      throw new TypeError(`env variable is undefined: '${this.key}.${jsonKey}'`);
    }

    return this.parse(jsonVal, envType);
  }

  getOrDefault(defaultVal: Primitive[T]): Primitive[T] {
    const val = process.env[this.key];

    if (typeof val === 'undefined') {
      return defaultVal;
    }

    return this.parse(val, this.type);
  }

  private parse(val: string, type: EnvType): Primitive[T] {
    switch (type) {
      case EnvType.String:
        return this.parseString(val) as Primitive[T];
      case EnvType.Number:
        return this.parseNumber(val) as Primitive[T];
      case EnvType.Boolean:
        return this.parseBoolean(val) as Primitive[T];
      case EnvType.Json:
        return this.parseJson(val) as Primitive[T];
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
