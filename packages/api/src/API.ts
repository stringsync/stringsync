import { createContainer, Pkg } from '@stringsync/di';
import { SERVICES } from '@stringsync/services';
import { UTIL } from '@stringsync/util';
import { ApiConfig, API_CONFIG } from './API_CONFIG';
import { API_TYPES } from './API_TYPES';
import { HealthController } from './app';
import { AuthResolver, ExperimentResolver, NotationResolver, TagResolver, UserResolver } from './schema';

export const API: Pkg = {
  name: 'API',
  deps: [UTIL, SERVICES],
  bindings: async (bind) => {
    const config = API_CONFIG();
    bind<ApiConfig>(API_TYPES.ApiConfig).toConstantValue(config);

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

    bind<HealthController>(API_TYPES.HealthController).to(HealthController);
  },
};

export const createApiContainer = async () => await createContainer(API);
