import { ContainerModule } from 'inversify';
import { UserResolver, HealthController } from '@stringsync/graphql';
import { TYPES } from './constants';

export const getGraphqlModule = () =>
  new ContainerModule((bind) => {
    bind<UserResolver>(UserResolver)
      .toSelf()
      .inSingletonScope();

    bind<HealthController>(TYPES.HealthController).to(HealthController);
  });
