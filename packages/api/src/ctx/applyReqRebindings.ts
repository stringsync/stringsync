import { ctor } from '@stringsync/common';
import { Container } from '@stringsync/di';
import { NotationLoader, REPOS_TYPES, TagLoader, UserLoader } from '@stringsync/repos';

export const applyReqRebindings = (container: Container) => {
  const userLoader = container.get<UserLoader>(REPOS_TYPES.UserLoader);
  container
    .rebind(REPOS_TYPES.UserLoader)
    .to(ctor(userLoader))
    .inSingletonScope();

  const notationLoader = container.get<NotationLoader>(REPOS_TYPES.NotationLoader);
  container
    .rebind(REPOS_TYPES.NotationLoader)
    .to(ctor(notationLoader))
    .inSingletonScope();

  const tagLoader = container.get<TagLoader>(REPOS_TYPES.TagLoader);
  container
    .rebind(REPOS_TYPES.TagLoader)
    .to(ctor(tagLoader))
    .inSingletonScope();
};
