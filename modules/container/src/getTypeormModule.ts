import { ContainerConfig } from '@stringsync/config';
import { AsyncContainerModule } from 'inversify';
import { Connection } from 'typeorm';
import { TYPES } from './constants';
import { connectToDb } from '../../typeorm/src';

export const getTypeormModule = async (config: ContainerConfig) =>
  new AsyncContainerModule(async (bind) => {
    const connection = await connectToDb(config);
    bind<Connection>(TYPES.Connection).toConstantValue(connection);
  });
