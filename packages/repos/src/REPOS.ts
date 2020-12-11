import { DB } from '@stringsync/db';
import { Pkg } from '@stringsync/di';
import { ReposConfig, REPOS_CONFIG } from './REPOS_CONFIG';
import { REPOS_TYPES } from './REPOS_TYPES';
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

export const REPOS: Pkg = {
  name: 'REPOS',
  deps: [DB],
  bindings: async (bind) => {
    const config = REPOS_CONFIG();
    bind<ReposConfig>(REPOS_TYPES.ReposConfig).toConstantValue(config);

    bind<UserLoader>(REPOS_TYPES.UserLoader).to(UserSequelizeLoader);
    bind<UserRepo>(REPOS_TYPES.UserRepo).to(UserSequelizeRepo);

    bind<NotationLoader>(REPOS_TYPES.NotationLoader).to(NotationSequelizeLoader);
    bind<NotationRepo>(REPOS_TYPES.NotationRepo).to(NotationSequelizeRepo);

    bind<TagLoader>(REPOS_TYPES.TagLoader).to(TagSequelizeLoader);
    bind<TagRepo>(REPOS_TYPES.TagRepo).to(TagSequelizeRepo);

    bind<TaggingRepo>(REPOS_TYPES.TaggingRepo).to(TaggingSequelizeRepo);
  },
};
