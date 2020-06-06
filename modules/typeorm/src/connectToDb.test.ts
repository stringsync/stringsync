import { Connection } from 'typeorm';
import { connectToDb } from './connectToDb';
import { getContainerConfig } from '@stringsync/config';

let connection: Connection | undefined;

afterEach(async () => {
  if (connection) {
    await connection.close();
  }
  connection = undefined;
});

it('runs without crashing', async () => {
  const config = getContainerConfig();

  const f = async () => {
    connection = await connectToDb(config);
  };

  await expect(f()).resolves.not.toThrow();
});
