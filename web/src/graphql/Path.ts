import { get } from 'lodash';

export class Path {
  static STAR = '0';

  private static SEPARATOR = '.';

  static create(...parts: string[]) {
    parts.forEach(Path.validate);
    return new Path(...parts);
  }

  private static validate = (part: string) => {
    if (part.includes(Path.SEPARATOR)) {
      throw new Error(`part cannot include: '${Path.SEPARATOR}'`);
    }
  };

  readonly parts: string[];

  private constructor(...parts: string[]) {
    this.parts = parts;
  }

  toString() {
    return this.parts.join(Path.SEPARATOR);
  }

  get<T = unknown>(object: any): T | undefined {
    return get(object, this.parts);
  }

  add = (part: string): Path => {
    Path.validate(part);
    return new Path(...this.parts, part);
  };

  match(path: Path): boolean {
    return this.toString() === path.toString();
  }
}
