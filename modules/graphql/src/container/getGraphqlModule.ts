import { ContainerModule } from 'inversify';
import { UserResolver } from '../schema';
import { HealthController } from '../app';
import { TYPES } from '@stringsync/common';

export const getGraphqlModule = () =>
  new ContainerModule((bind) => {
    bind<UserResolver>(UserResolver)
      .toSelf()
      .inSingletonScope();

    bind<HealthController>(TYPES.HealthController).to(HealthController);
  });
