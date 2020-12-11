import { interfaces } from 'inversify';

export type Bindings = (bind: interfaces.Bind) => Promise<void>;

export type Pkg = {
  name: string;
  deps: Pkg[];
  bindings: Bindings;
};
