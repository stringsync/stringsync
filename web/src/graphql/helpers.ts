import { isPlainObject } from 'lodash';

type Meta = { isEnum?: boolean };

const META_KEY = Symbol('meta');

export const injectMeta = (object: any, meta: Meta) => {
  if (!isPlainObject(object)) {
    throw new Error(`can only inject metadata into plain objects, got: ${object}`);
  }
  object[META_KEY] = meta;
  return object;
};

export const getMeta = (object: any): Meta | undefined => {
  if (!isPlainObject(object)) {
    return undefined;
  }
  return object[META_KEY];
};
