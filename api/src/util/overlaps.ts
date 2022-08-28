import { DeepPartial } from './types';

const isObject = (value: any): value is Record<string, unknown> => {
  return value !== null && typeof value === 'object';
};

export const overlaps = <T extends Record<string, unknown>>(proto: T, probe: DeepPartial<T>): boolean => {
  return Object.entries(probe).every(([key, probeVal]) => {
    if (!(key in proto)) {
      return false;
    }
    const protoVal = proto[key];
    if (probeVal === null) {
      return protoVal === null;
    }
    if (isObject(protoVal) && isObject(probeVal)) {
      return overlaps(protoVal, probeVal);
    }
    if (protoVal === probeVal) {
      return true;
    }
    return false;
  });
};
