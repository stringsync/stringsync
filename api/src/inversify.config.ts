// organize-imports-ignore
import 'reflect-metadata';
import { Container } from 'inversify';
import { Db, SequelizeDb } from './db';
import { TYPES } from './inversify.constants';
import { Logger } from './util';
import { WinstonLogger } from './util/logger/WinstonLogger';
import { getConfig, Config } from './config';
import { SequelizeTagLoader, TagLoader } from './repos';

export const container = new Container();

const config = getConfig();

container
  .bind<Db>(TYPES.Db)
  .to(SequelizeDb)
  .inSingletonScope();
container.bind<Logger>(TYPES.Logger).to(WinstonLogger);
container.bind<Config>(TYPES.Config).toConstantValue(getConfig());
container.bind<TagLoader>(TYPES.TagLoader).to(SequelizeTagLoader);
