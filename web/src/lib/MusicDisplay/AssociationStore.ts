import { GraphicalObject } from 'opensheetmusicdisplay';

type Keyable = SVGGElement;

type Associatable = GraphicalObject;

/**
 * This class manages associations between arbitrary objects
 */
export class AssociationStore {
  static keyof(keyable: Keyable): string {
    throw new Error(`could not calculate key for object: ${keyable}`);
  }

  private readonly graphics: Record<string, GraphicalObject> = {};
  private readonly strict: boolean;

  constructor(strict = true) {
    this.strict = strict;
  }

  associate(keyable: Keyable, associatable: Associatable) {
    const key = AssociationStore.keyof(keyable);

    if (associatable instanceof GraphicalObject) {
      this.put(this.graphics, key, associatable);
    }
  }

  getGraphicalObject(keyable: Keyable) {
    const key = AssociationStore.keyof(keyable);
    return this.get(this.graphics, key);
  }

  private put<T>(map: Record<string, T>, key: string, value: T) {
    if (this.strict && this.hasKey(map, key)) {
      throw new Error(`strict mode, cannot put duplicate key: ${key}`);
    }
    map[key] = value;
  }

  private get<T>(map: Record<string, T>, key: string) {
    if (this.strict && !this.hasKey(map, key)) {
      throw new Error(`strict mode, cannot get missing key: ${key}`);
    }
    return map[key] ?? null;
  }

  private hasKey<T>(map: Record<string, T>, key: string) {
    return key in map;
  }
}