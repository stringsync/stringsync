export type Ctor<T> = {
  new (...args: any[]): T;
};

export const ctor = <T>(instance: T): Ctor<T> => Object.getPrototypeOf(instance).constructor;
