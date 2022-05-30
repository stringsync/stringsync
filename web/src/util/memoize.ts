import { get, isFunction, isUndefined } from 'lodash';
import { InternalError } from '../lib/errors';

export const memoize = () => (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
  let fn = descriptor.value;
  if (!isFunction(fn)) {
    throw new InternalError(`can only memoize methods, got: ${fn}`);
  }
  if (fn.length > 0) {
    throw new InternalError('cannot memoize methods with arguments');
  }

  const key = `__memoize_${propertyKey}`;

  descriptor.value = function(...args: any[]) {
    if (args.length) {
      throw new InternalError('cannot memoize methods with arguments');
    }
    if (isUndefined(this)) {
      throw new InternalError('cannot memoize unbound methods');
    }
    if (!this.hasOwnProperty(key)) {
      Object.defineProperty(this, key, {
        configurable: false,
        enumerable: false,
        writable: false,
        value: fn.call(this),
      });
    }
    return get(this, key);
  };

  return descriptor;
};
