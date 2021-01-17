import { Ctor } from './types';

export const ctor = <T>(instance: T): Ctor<T> => Object.getPrototypeOf(instance).constructor;
