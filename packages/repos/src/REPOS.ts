import { configFactory, NODE_ENV } from '@stringsync/config';
import { DB } from '@stringsync/db';
import { Pkg } from '@stringsync/di';
import {
  NotationSequelizeLoader,
  NotationSequelizeRepo,
  TaggingSequelizeRepo,
  TagSequelizeLoader,
  TagSequelizeRepo,
  UserSequelizeLoader,
  UserSequelizeRepo,
} from './sequelize';
import { NotationLoader, NotationRepo, TaggingRepo, TagLoader, TagRepo, UserLoader, UserRepo } from './types';

export const REPOS_CONFIG = configFactory({
  NODE_ENV: NODE_ENV,
});

export type ReposConfig = ReturnType<typeof REPOS_CONFIG>;

export const TYPES = {
  ReposConfig: Symbol('ReposConfig'),
  UserLoader: Symbol('UserLoader'),
  UserRepo: Symbol('UserRepo'),
  NotationLoader: Symbol('NotationLoader'),
  NotationRepo: Symbol('NotationRepo'),
  TagLoader: Symbol('TagLoader'),
  TagRepo: Symbol('TagRepo'),
  TaggingRepo: Symbol('TaggingRepo'),
};

export const REPOS: Pkg<typeof TYPES> = {
  name: 'REPOS',
  TYPES,
  deps: [DB],
  bindings: async (bind) => {
    const config = REPOS_CONFIG();
    bind<ReposConfig>(TYPES.ReposConfig).toConstantValue(config);

    bind<UserLoader>(TYPES.UserLoader).to(UserSequelizeLoader);
    bind<UserRepo>(TYPES.UserRepo).to(UserSequelizeRepo);

    bind<NotationLoader>(TYPES.NotationLoader).to(NotationSequelizeLoader);
    bind<NotationRepo>(TYPES.NotationRepo).to(NotationSequelizeRepo);

    bind<TagLoader>(TYPES.TagLoader).to(TagSequelizeLoader);
    bind<TagRepo>(TYPES.TagRepo).to(TagSequelizeRepo);

    bind<TaggingRepo>(TYPES.TaggingRepo).to(TaggingSequelizeRepo);
  },
};
