import { Container } from 'inversify';
import { TYPES } from '@stringsync/container';
import { UserService, NotationService, TagService } from '@stringsync/services';

export const applyRebindings = (container: Container) => {
  container
    .rebind(TYPES.UserService)
    .to(UserService)
    .inSingletonScope();

  container
    .rebind(TYPES.NotationService)
    .to(NotationService)
    .inSingletonScope();

  container
    .rebind(TYPES.TagService)
    .to(NotationService)
    .inSingletonScope();
};
