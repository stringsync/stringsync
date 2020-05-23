import { transactionFactory } from './transactionFactory';
import { Sequelize, Transaction } from 'sequelize';
import { TRANSACTION_NAMESPACE } from './constants';
import { connectToDb } from './connectToDb';
import { getConfig } from '../../config';
import { getLogger } from '../../util/logger';

let transaction: ReturnType<typeof transactionFactory>;
let sequelize: Sequelize;
const config = getConfig(process.env);
const namespace = TRANSACTION_NAMESPACE;
const logger = getLogger();

beforeEach(() => {
  sequelize = connectToDb(config, namespace, logger).sequelize;
  transaction = transactionFactory(sequelize, namespace);
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
