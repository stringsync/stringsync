import { ContainerModule } from 'inversify';
import { UserResolver, HealthController, AuthResolver } from '@stringsync/graphql';
import { TYPES } from './constants';
import { ContainerConfig } from '@stringsync/config';
import { TagResolver } from '@stringsync/graphql/src/schema/resolvers/Tag';

export const getGraphqlModule = (config: ContainerConfig) =>
  new ContainerModule((bind) => {
    bind<UserResolver>(UserResolver)
      .toSelf()
      .inSingletonScope();
    bind<TagResolver>(TagResolver)
      .toSelf()
      .inSingletonScope();

    bind<AuthResolver>(AuthResolver).toSelf();

    bind<HealthController>(TYPES.HealthController).to(HealthController);
  });
