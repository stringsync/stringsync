import { APP_GRAPHQL_PORT, APP_SESSION_SECRET, APP_WEB_URI, configFactory, NODE_ENV } from '@stringsync/config';
import { createContainer, Pkg } from '@stringsync/di';
import { SERVICES } from '@stringsync/services';
import { UTIL } from '@stringsync/util';
import { HealthController } from './app';
import { AuthResolver, ExperimentResolver, NotationResolver, TagResolver, UserResolver } from './schema';

export const API_CONFIG = configFactory({
  NODE_ENV: NODE_ENV,
  APP_GRAPHQL_PORT: APP_GRAPHQL_PORT,
  APP_SESSION_SECRET: APP_SESSION_SECRET,
  APP_WEB_URI: APP_WEB_URI,
});

export type ApiConfig = ReturnType<typeof API_CONFIG>;

export const TYPES = {
  ApiConfig: Symbol('ApiConfig'),
  HealthController: Symbol('HealthController'),
};

export const API: Pkg<typeof TYPES> = {
  name: 'API',
  TYPES,
  deps: [UTIL, SERVICES],
  bindings: async (bind) => {
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
  },
};

export const createApiContainer = async () => await createContainer(API);
