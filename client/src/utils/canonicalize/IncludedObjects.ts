import { merge } from 'lodash';
import { IIdentifier, IIncluded } from '../../@types/json-api';

// The primary data structure that backs IncludedObjects.
export interface IObjectMap {
  [type: string]: {
    [id: number]: object;
  };
}

// This class encapsulates the logic for indexing included objects (from the API) as well
// accessing them.
export class IncludedObjects {
  public included: IIncluded[];
  private map: IObjectMap;

  constructor(included: IIncluded[]) {
    this.included = included;
    this.map = this.getObjectMap();
  }

  // Fetches from the map instance variable. This is a flatter interface to work with instead
  // of having the caller to index into the map instance variable.
  //
  // The caller can pass a single identifier or an array of identifiers. Passing in a
  // single identifier returns a single object. Passing in an array of identifiers returns
  // an array of objects.
  //
  // If an array of non unique identifiers are passed in, then their respective objects will show
  // multiple times in the array. These elements are duped so that they can be independently
  // modified.
  public fetch(identifier: IIdentifier): object;
  public fetch(identifiers: IIdentifier[]): object[];
  public fetch(identifier: IIdentifier | IIdentifier[]): object | object[] {
    return Array.isArray(identifier) ? this.fetchMany(identifier) : this.fetchOne(identifier);
  }

  // Fetches a single object from the map.
  private fetchOne(identifier: IIdentifier): object {
    return this.map[identifier.type][identifier.id];
  }

  private fetchMany(identifiers: IIdentifier[]): object[] {
    return identifiers.map(identifier => merge({}, this.fetchOne(identifier)));
  }

  // Computes the objectMap variable.
  private getObjectMap(): IObjectMap {
    return this.included.reduce((memo, object) => {
      const { type, id } = object;
      memo[type] = memo[type] || {};
      memo[type][id] = object;
      return memo;
    }, {});
  }
}
