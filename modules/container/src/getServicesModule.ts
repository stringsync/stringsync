import { ContainerConfig } from '@stringsync/config';
import { ContainerModule } from 'inversify';
import { TYPES } from '@stringsync/container';
import { UserService } from '@stringsync/services';

export const getServicesModule = (config: ContainerConfig) =>
  new ContainerModule(async (bind) => {
    bind<UserService>(TYPES.UserService).to(UserService);
  });
