import { ContainerConfig } from '@stringsync/config';
import { ContainerModule } from 'inversify';
import { TYPES } from '@stringsync/container';
import { UserSequelizeRepo, UserRepo, NotationRepo, NotationSequelizeRepo, TagRepo } from '@stringsync/repos';
import { TagSequelizeRepo } from '@stringsync/repos/src/sequelize/TagSequelizeRepo';

export const getReposModule = (config: ContainerConfig) => {
  return new ContainerModule((bind) => {
    bind<UserRepo>(TYPES.UserRepo).to(UserSequelizeRepo);
    bind<UserSequelizeRepo>(TYPES.UserSequelizeRepo).to(UserSequelizeRepo);

    bind<NotationRepo>(TYPES.NotationRepo).to(NotationSequelizeRepo);
    bind<NotationSequelizeRepo>(TYPES.NotationSequelizeRepo).to(NotationSequelizeRepo);

    bind<TagRepo>(TYPES.TagRepo).to(TagSequelizeRepo);
    bind<TagSequelizeRepo>(TYPES.TagSequelizeRepo).to(TagSequelizeRepo);
  });
};
