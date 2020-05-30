import { Sequelize, Transaction } from 'sequelize';
import { Task } from './Db';
import { Namespace } from 'cls-hooked';

export const transactionFactory = (sequelize: Sequelize, namespaceName: string, namespace: Namespace) => async <T>(
  task: Task<T>
): Promise<T> => {
  const transaction: Transaction | undefined = namespace.get(namespaceName);
  return await (transaction ? task(transaction) : sequelize.transaction(task));
};
