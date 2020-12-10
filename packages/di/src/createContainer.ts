import { AsyncContainerModule, Container } from 'inversify';
import { Bindings, Pkg } from './types';

const getBindings = (pkgs: Pkg<any>[], seen = new Set<string>()): Bindings[] => {
  let bindings = new Array<Bindings>();
  for (const pkg of pkgs) {
    if (seen.has(pkg.name)) {
      continue;
    }
    seen.add(pkg.name);
    bindings.push(pkg.bindings);
    for (const dep of pkg.deps) {
      if (!seen.has(pkg.name)) {
        bindings = [...bindings, ...getBindings([dep], seen)];
      }
    }
  }
  return bindings;
};

export const createContainer = async (...pkgs: Pkg<any>[]) => {
  const container = new Container();

  const bindings = getBindings(pkgs);
  const mods = bindings.map((binding) => new AsyncContainerModule(binding));
  await container.loadAsync(...mods);

  return container;
};
