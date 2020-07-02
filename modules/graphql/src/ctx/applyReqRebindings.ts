import { Container } from 'inversify';
import { TYPES } from '@stringsync/container';
import { UserLoader, NotationLoader } from '@stringsync/repos';
import { Ctor } from '@stringsync/common';

export const applyReqRebindings = (container: Container) => {
  const UserLoaderCtor = container.get<Ctor<UserLoader>>(TYPES.UserLoaderCtor);
  const NotationLoaderCtor = container.get<Ctor<NotationLoader>>(TYPES.NotationLoaderCtor);

  container
    .rebind(TYPES.UserLoader)
    .to(UserLoaderCtor)
    .inSingletonScope();

  container
    .rebind(TYPES.NotationLoader)
    .to(NotationLoaderCtor)
    .inSingletonScope();
};
