import { SyncMod, TYPES } from '@stringsync/di';
import { ReposConfig, REPOS_CONFIG } from './config';
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

export const API = new SyncMod((bind) => {
  const config = REPOS_CONFIG();
  bind<ReposConfig>(TYPES.ReposConfig).toConstantValue(config);

  bind<UserLoader>(TYPES.UserLoader).to(UserSequelizeLoader);
  bind<UserRepo>(TYPES.UserRepo).to(UserSequelizeRepo);

  bind<NotationLoader>(TYPES.NotationLoader).to(NotationSequelizeLoader);
  bind<NotationRepo>(TYPES.NotationRepo).to(NotationSequelizeRepo);

  bind<TagLoader>(TYPES.TagLoader).to(TagSequelizeLoader);
  bind<TagRepo>(TYPES.TagRepo).to(TagSequelizeRepo);

  bind<TaggingRepo>(TYPES.TaggingRepo).to(TaggingSequelizeRepo);
});
