import { Config } from '../config';
import { Container } from 'inversify';
import { getReposModule } from './getReposModule';

export const getContainer = (config: Config) => {
  const container = new Container();

  const reposModule = getReposModule(config);
  container.load(reposModule);

  return container;
};
