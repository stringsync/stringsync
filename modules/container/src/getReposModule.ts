import { Ctor } from '@stringsync/common';
import { ContainerConfig } from '@stringsync/config';
import { ContainerModule } from 'inversify';
import { TYPES } from '@stringsync/container';
import { UserSequelizeLoader, UserLoader, UserSequelizeRepo, UserRepo } from '@stringsync/repos';
import { NotationSequelizeLoader, NotationLoader, NotationRepo, NotationSequelizeRepo } from '@stringsync/repos';
import { TagLoader, TagRepo, TagSequelizeRepo, TagSequelizeLoader } from '@stringsync/repos';
import { TaggingRepo, TaggingSequelizeRepo } from '@stringsync/repos';

export const getReposModule = (config: ContainerConfig) => {
  return new ContainerModule((bind) => {
    bind<UserLoader>(TYPES.UserLoader).to(UserSequelizeLoader);
    bind<Ctor<UserLoader>>(TYPES.UserLoaderCtor).toConstructor(UserSequelizeLoader);
    bind<UserRepo>(TYPES.UserRepo).to(UserSequelizeRepo);

    bind<NotationLoader>(TYPES.NotationLoader).to(NotationSequelizeLoader);
    bind<Ctor<NotationLoader>>(TYPES.NotationLoaderCtor).toConstructor(NotationSequelizeLoader);
    bind<NotationRepo>(TYPES.NotationRepo).to(NotationSequelizeRepo);

    bind<TagLoader>(TYPES.TagLoader).to(TagSequelizeLoader);
    bind<Ctor<TagLoader>>(TYPES.TagLoaderCtor).toConstructor(TagSequelizeLoader);
    bind<TagRepo>(TYPES.TagRepo).to(TagSequelizeRepo);

    bind<TaggingRepo>(TYPES.TaggingRepo).to(TaggingSequelizeRepo);

    if (config.NODE_ENV === 'test') {
      bind<UserSequelizeLoader>(TYPES.UserSequelizeLoader).to(UserSequelizeLoader);
      bind<UserSequelizeRepo>(TYPES.UserSequelizeRepo).to(UserSequelizeRepo);

      bind<NotationSequelizeLoader>(TYPES.NotationSequelizeLoader).to(NotationSequelizeLoader);
      bind<NotationSequelizeRepo>(TYPES.NotationSequelizeRepo).to(NotationSequelizeRepo);

      bind<TagSequelizeLoader>(TYPES.TagSequelizeLoader).to(TagSequelizeLoader);
      bind<TagSequelizeRepo>(TYPES.TagSequelizeRepo).to(TagSequelizeRepo);

      bind<TaggingSequelizeRepo>(TYPES.TaggingSequelizeRepo).to(TaggingSequelizeRepo);
    }
  });
};
