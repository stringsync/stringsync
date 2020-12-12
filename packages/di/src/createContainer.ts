import { AsyncContainerModule, Container } from 'inversify';
import { Pkg } from './types';

const getPkgs = (pkg: Pkg, seen = new Set<string>()): Pkg[] => {
  let pkgs = new Array<Pkg>();

  seen.add(pkg.name);
  pkgs.push(pkg);

  for (const dep of pkg.deps) {
    if (!seen.has(dep.name)) {
      pkgs = [...pkgs, ...getPkgs(dep, seen)];
    }
  }

  return pkgs;
};

export const createContainer = async (pkg: Pkg) => {
  const pkgs = getPkgs(pkg);

  const container = new Container();

  const mods = pkgs.map((pkg) => new AsyncContainerModule(pkg.bindings));
  await container.loadAsync(...mods);

  const cleanups = pkgs.filter((pkg) => pkg.cleanup).map((pkg) => pkg.cleanup!);
  const cleanup = async () => {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('cannot cleanup in production');
    }
    await Promise.all(cleanups.map((cleanup) => cleanup(container)));
  };

  const teardowns = pkgs.filter((pkg) => pkg.cleanup).map((pkg) => pkg.teardown!);
  const teardown = async () => {
    await Promise.all(teardowns.map((teardown) => teardown(container)));
  };

  return { container, cleanup, teardown };
};
