import { Container, interfaces } from 'inversify';

export type Bindings = (bind: interfaces.Bind) => Promise<void>;

export type ContainerCallback = (container: Container) => Promise<void>;

export type Pkg = {
  name: string;
  deps: Pkg[];
  bindings: Bindings;
  setup?: ContainerCallback;
  cleanup?: ContainerCallback;
  teardown?: ContainerCallback;
};

export type TestContainerRef = {
  container: Container;
  setup?: ContainerCallback;
  cleanup?: ContainerCallback;
  teardown?: ContainerCallback;
};
