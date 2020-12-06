import { containerFactory, SyncMod, TYPES } from '@stringsync/di';
import { SERVICES } from '@stringsync/services';
import { HealthController } from './app';
import { ApiConfig, API_CONFIG } from './config';
import { ExperimentResolver, NotationResolver, TagResolver, UserResolver } from './schema';

export const API = new SyncMod((bind) => {
  const config = API_CONFIG();
  bind<ApiConfig>(TYPES.ApiConfig).toConstantValue(config);

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

export const createContainer = containerFactory(API, SERVICES);
