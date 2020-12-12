import { Container, interfaces } from 'inversify';

export type Bindings = (bind: interfaces.Bind) => Promise<void>;

export type Cleanup = (container: Container) => Promise<void>;

export type Teardown = (container: Container) => Promise<void>;

export type Pkg = {
  name: string;
  deps: Pkg[];
  bindings: Bindings;
  cleanup?: Cleanup;
  teardown?: Teardown;
};
