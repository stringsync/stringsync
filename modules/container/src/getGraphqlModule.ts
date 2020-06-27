import { ContainerModule } from 'inversify';
import { UserResolver, HealthController, AuthResolver } from '@stringsync/graphql';
import { TYPES } from './constants';
import { ContainerConfig } from '@stringsync/config';

export const getGraphqlModule = (config: ContainerConfig) =>
  new ContainerModule((bind) => {
    bind<UserResolver>(UserResolver).toSelf();

    bind<AuthResolver>(AuthResolver).toSelf();

    bind<HealthController>(TYPES.HealthController).to(HealthController);
  });
