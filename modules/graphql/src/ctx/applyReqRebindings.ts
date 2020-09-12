import { Container } from 'inversify';
import { TYPES } from '@stringsync/di';
import { UserLoader, NotationLoader, TagLoader } from '@stringsync/repos';
import { Ctor } from '@stringsync/common';

export const applyReqRebindings = (container: Container) => {
  const UserLoaderCtor = container.get<Ctor<UserLoader>>(TYPES.UserLoaderCtor);
  const NotationLoaderCtor = container.get<Ctor<NotationLoader>>(TYPES.NotationLoaderCtor);
  const TagLoaderCtor = container.get<Ctor<TagLoader>>(TYPES.TagLoaderCtor);

  container
    .rebind(TYPES.UserLoader)
    .to(UserLoaderCtor)
    .inSingletonScope();

  container
    .rebind(TYPES.NotationLoader)
    .to(NotationLoaderCtor)
    .inSingletonScope();

  container
    .rebind(TYPES.TagLoader)
    .to(TagLoaderCtor)
    .inSingletonScope();
};
