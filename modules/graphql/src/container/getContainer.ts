import { Config, getConfig } from '../config';
import { Container } from 'inversify';
import { TYPES } from './TYPES';
import { getReposModule } from './getReposModule';

export const getContainer = () => {
  const container = new Container();

  const config = getConfig(process.env);
  container.bind<Config>(TYPES.Config).toConstantValue(config);

  // const reposModule = getReposModule(config);
  // container.load(reposModule);

  return container;
};
