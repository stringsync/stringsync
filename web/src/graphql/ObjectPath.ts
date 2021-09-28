import { get } from 'lodash';

/**
 * An object path represents the property keys needed to get to a specific value.
 *
 * It is intended to be exclusively used with the Gql module.
 */
export class ObjectPath {
  static STAR = '0';

  private static SEPARATOR = '.';

  static create(...parts: string[]) {
    parts.forEach(ObjectPath.validate);
    return new ObjectPath(...parts);
  }

  private static validate = (part: string) => {
    if (part.includes(ObjectPath.SEPARATOR)) {
      throw new Error(`part cannot include: '${ObjectPath.SEPARATOR}'`);
    }
  };

  readonly parts: string[];

  private constructor(...parts: string[]) {
    this.parts = parts;
  }

  toString() {
    return this.parts.join(ObjectPath.SEPARATOR);
  }

  get<T = unknown>(object: any): T | undefined {
    return get(object, this.parts);
  }

  add = (part: string): ObjectPath => {
    ObjectPath.validate(part);
    return new ObjectPath(...this.parts, part);
  };

  match(path: ObjectPath): boolean {
    return this.toString() === path.toString();
  }
}
