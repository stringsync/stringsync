import { ctor } from '@stringsync/common';
import { Container, TYPES } from '@stringsync/di';
import { NotationLoader, TagLoader, UserLoader } from '@stringsync/repos';

export const applyReqRebindings = (container: Container) => {
  const userLoader = container.get<UserLoader>(TYPES.UserLoader);
  container
    .rebind(TYPES.UserLoader)
    .to(ctor(userLoader))
    .inSingletonScope();

  const notationLoader = container.get<NotationLoader>(TYPES.NotationLoader);
  container
    .rebind(TYPES.NotationLoader)
    .to(ctor(notationLoader))
    .inSingletonScope();

  const tagLoader = container.get<TagLoader>(TYPES.TagLoader);
  container
    .rebind(TYPES.TagLoader)
    .to(ctor(tagLoader))
    .inSingletonScope();
};
