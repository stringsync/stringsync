import { ContainerModule } from 'inversify';
import { UserResolver } from '../schema/resolvers';

export const getGraphqlModule = () =>
  new ContainerModule((bind) => {
    bind<UserResolver>(UserResolver)
      .toSelf()
      .inSingletonScope();
  });
