import { DB } from '@stringsync/db';
import { containerFactory, SyncMod, TYPES } from '@stringsync/di';
import { REPOS } from '@stringsync/repos';
import { SERVICES } from '@stringsync/services';
import { UTIL } from '@stringsync/util';
import { HealthController } from './app';
import { ApiConfig, API_CONFIG } from './config';
import { AuthResolver, ExperimentResolver, NotationResolver, TagResolver, UserResolver } from './schema';

export const API = new SyncMod((bind) => {
  const config = API_CONFIG();
  bind<ApiConfig>(TYPES.ApiConfig).toConstantValue(config);

  bind<AuthResolver>(AuthResolver)
    .toSelf()
    .inSingletonScope();
  bind<UserResolver>(UserResolver)
    .toSelf()
    .inSingletonScope();
  bind<TagResolver>(TagResolver)
    .toSelf()
    .inSingletonScope();
  bind<NotationResolver>(NotationResolver)
    .toSelf()
    .inSingletonScope();
  bind<ExperimentResolver>(ExperimentResolver)
    .toSelf()
    .inSingletonScope();

  bind<HealthController>(TYPES.HealthController).to(HealthController);
});

export const createApiContainer = containerFactory(API, UTIL, SERVICES, REPOS, DB);
