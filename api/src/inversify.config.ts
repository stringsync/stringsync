import { Container } from 'inversify';
import 'reflect-metadata';
import { Config, getConfig } from './config';
import { Db, SequelizeDb } from './db';
import { TYPES } from './inversify.constants';
import {
  NotationLoader,
  NotationRepo,
  SequelizeNotationLoader,
  SequelizeNotationRepo,
  SequelizeTaggingRepo,
  SequelizeTagLoader,
  SequelizeTagRepo,
  SequelizeUserLoader,
  SequelizeUserRepo,
  TaggingRepo,
  TagLoader,
  TagRepo,
  UserLoader,
  UserRepo,
} from './repos';
import { Logger, WinstonLogger } from './util';

export const container = new Container();

const config = getConfig();

container
  .bind<Db>(TYPES.Db)
  .to(SequelizeDb)
  .inSingletonScope();
container.bind<Logger>(TYPES.Logger).to(WinstonLogger);
container.bind<Config>(TYPES.Config).toConstantValue(getConfig());

container.bind<TagLoader>(TYPES.TagLoader).to(SequelizeTagLoader);
container.bind<TagRepo>(TYPES.TagRepo).to(SequelizeTagRepo);

container.bind<UserRepo>(TYPES.UserRepo).to(SequelizeUserRepo);
container.bind<UserLoader>(TYPES.UserLoader).to(SequelizeUserLoader);

container.bind<NotationRepo>(TYPES.NotationRepo).to(SequelizeNotationRepo);
container.bind<NotationLoader>(TYPES.NotationLoader).to(SequelizeNotationLoader);

container.bind<TaggingRepo>(TYPES.TaggingRepo).to(SequelizeTaggingRepo);
