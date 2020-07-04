import { TYPES } from '@stringsync/container';
import { UserLoader, NotationLoader } from '@stringsync/repos';
import { Container } from 'inversify';

export const startListeningForChanges = (container: Container) => {
  const userLoader = container.get<UserLoader>(TYPES.UserLoader);
  const notationLoader = container.get<NotationLoader>(TYPES.NotationLoader);

  userLoader.startListeningForChanges();
  notationLoader.startListeningForChanges();
};
