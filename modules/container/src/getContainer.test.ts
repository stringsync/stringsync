import { getContainer } from './getContainer';
import { getContainerConfig } from '@stringsync/config';
import { Container } from 'inversify';
import { TYPES } from './constants';
import { Connection } from 'typeorm';

let container: Container | undefined;

afterEach(async () => {
  if (container) {
    const connection = container.get<Connection>(TYPES.Connection);
    await connection.close();
    // const redis = container.get<Redis>(TYPES.Redis);
    // redis.disconnect();
  }
  container = undefined;
});

it('runs without crashing', async () => {
  const config = getContainerConfig();
  const fn = async () => {
    container = await getContainer(config);
  };
  await expect(fn()).resolves.not.toThrow();
});
