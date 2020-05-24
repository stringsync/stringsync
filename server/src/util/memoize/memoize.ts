import memo from 'memoizee';

export const memoize = (): MethodDecorator => (target, key, descriptor) => {
  if ('value' in descriptor) {
    const func = descriptor.value as any;
    descriptor.value = memo(func);
  } else if ('get' in descriptor) {
    const func = descriptor.get as any;
    descriptor.get = memo(func);
  }
  return descriptor;
};
