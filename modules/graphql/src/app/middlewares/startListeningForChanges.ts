import { TYPES } from '@stringsync/container';
import { UserLoader } from '@stringsync/repos';
import { Container } from 'inversify';

export const startListeningForChanges = (container: Container) => {
  const userLoader = container.get<UserLoader>(TYPES.UserLoader);
  userLoader.startListeningForChanges();
};
