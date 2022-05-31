import { isBoolean, isNull, isNumber, isObject, isPlainObject, isString } from 'lodash';
import { ObjectPath } from './ObjectPath';

type Meta = {
  isEnum?: boolean;
  isFile?: boolean;
};

const META_KEY = Symbol('meta');

type Leaf = string | number | null | boolean | File;

type Entry = Leaf | Object | Object[] | Leaf[];

type ForEachEntryCallback = (entry: Entry, truePath: ObjectPath, schemaPath: ObjectPath) => void;

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

const isLeaf = (val: any): val is Leaf => {
  return isString(val) || isNumber(val) || isNull(val) || isBoolean(val) || val instanceof File;
};

export const forEachEntry = (
  root: any,
  callback: ForEachEntryCallback,
  truePath = ObjectPath.create(),
  schemaPath = ObjectPath.create()
) => {
  callback(root, truePath, schemaPath);

  if (isLeaf(root)) {
    return;
  } else if (Array.isArray(root)) {
    root.forEach((el, ndx) => {
      forEachEntry(el, callback, truePath.add(ndx.toString()), schemaPath.add(ObjectPath.STAR));
    });
  } else if (isObject(root)) {
    Object.entries(root).forEach(([key, val]) => {
      forEachEntry(val, callback, truePath.add(key), schemaPath.add(key));
    });
  } else {
    const msg = `unhandled root: ${root}`;
    console.error(msg);
    throw new Error(msg);
  }
};
