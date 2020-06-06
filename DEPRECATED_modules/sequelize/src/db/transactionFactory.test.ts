import { transactionFactory } from './transactionFactory';
import { Sequelize, Transaction } from 'sequelize';
import { connectToDb } from './connectToDb';
import { getContainerConfig } from '@stringsync/config';

let transaction: ReturnType<typeof transactionFactory>;
let sequelize: Sequelize;
const config = getContainerConfig();

beforeEach(() => {
  sequelize = connectToDb(config).sequelize;
  transaction = transactionFactory(sequelize);
});

afterEach(async () => {
  await sequelize.close();
});

it('creates transactions', async () => {
  await transaction(async (t) => {
    expect(t).toBeInstanceOf(Transaction);
  });
});

it('reuses transactions when nested', async () => {
  await transaction(async (t1) => {
    await transaction(async (t2) => {
      expect(t1).toBe(t2);
    });
  });
});
