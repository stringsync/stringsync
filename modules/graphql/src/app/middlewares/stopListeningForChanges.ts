import { TYPES } from '@stringsync/container';
import { UserLoader, NotationLoader, TagLoader } from '@stringsync/repos';
import { Container } from 'inversify';

export const stopListeningForChanges = (container: Container) => {
  const userLoader = container.get<UserLoader>(TYPES.UserLoader);
  const notationLoader = container.get<NotationLoader>(TYPES.NotationLoader);
  const tagLoader = container.get<TagLoader>(TYPES.TagLoader);

  userLoader.stopListeningForChanges();
  notationLoader.stopListeningForChanges();
  tagLoader.stopListeningForChanges();
};
