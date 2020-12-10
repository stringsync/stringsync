import { interfaces } from 'inversify';

export type Bindings = (bind: interfaces.Bind) => Promise<void>;

export type Pkg<T extends Record<string, symbol>> = {
  TYPES: T;
  name: string;
  deps: Pkg<any>[];
  bindings: Bindings;
};
