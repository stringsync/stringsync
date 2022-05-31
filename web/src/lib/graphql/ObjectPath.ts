import { get, set, toPath } from 'lodash';

/**
 * An object path represents the property keys needed to get to a specific value.
 *
 * It is intended to be exclusively used with the Gql module.
 */
export class ObjectPath {
  static STAR = '0';

  private static SEPARATOR = '.';

  static create(...parts: string[]) {
    return new ObjectPath(...parts);
  }

  static fromString(partStr: string) {
    return ObjectPath.create(...toPath(partStr));
  }

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

  set(object: any, value: any) {
    set(object, this.parts, value);
  }

  add(part: string): ObjectPath {
    return new ObjectPath(...this.parts, part);
  }

  match(path: ObjectPath): boolean {
    return this.toString() === path.toString();
  }
}
