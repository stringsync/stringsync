import { AsyncContainerModule, Container } from 'inversify';
import { Bindings, Pkg } from './types';

const getBindings = (pkg: Pkg, seen = new Set<string>()): Bindings[] => {
  let bindings = new Array<Bindings>();
  seen.add(pkg.name);
  bindings.push(pkg.bindings);
  for (const dep of pkg.deps) {
    if (!seen.has(dep.name)) {
      bindings = [...bindings, ...getBindings(dep, seen)];
    }
  }

  return bindings;
};

export const createContainer = async (pkg: Pkg) => {
  const container = new Container();

  const bindings = getBindings(pkg);
  const mods = bindings.map((binding) => new AsyncContainerModule(binding));
  await container.loadAsync(...mods);

  return container;
};
