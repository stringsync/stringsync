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

const TYPES = { ...REPOS_TYPES };

export const REPOS: Pkg = {
  name: 'REPOS',
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
