import { AsyncContainerModule, Container, ContainerModule } from 'inversify';
import { Mod } from './types';

const isContainerModule = (module: Mod): module is ContainerModule => {
  return module instanceof ContainerModule;
};

const isAsyncContainerModule = (module: Mod): module is AsyncContainerModule => {
  return module instanceof AsyncContainerModule;
};

export const containerFactory = (...mods: Mod[]) => async () => {
  const container = new Container();

  const syncMods = mods.filter(isContainerModule);
  container.load(...syncMods);

  const asyncMods = mods.filter(isAsyncContainerModule);
  await container.loadAsync(...asyncMods);

  return container;
};
