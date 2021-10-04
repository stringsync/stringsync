import { isFunction } from 'lodash';
import { InternalError } from '../errors';

export const memoize = () => (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
  let fn = descriptor.value;
  if (!isFunction(fn)) {
    throw new InternalError(`can only memoize methods, got: ${fn}`);
  }
  if (fn.length > 0) {
    throw new InternalError('cannot memoize methods with arguments');
  }

  let value: any;
  let isCached = false;

  descriptor.value = function(...args: any[]) {
    if (args.length) {
      throw new InternalError('cannot memoize methods with arguments');
    }
    if (!isCached) {
      value = fn.call(this);
      isCached = true;
    }
    return value;
  };
};
