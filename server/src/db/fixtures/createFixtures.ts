import { Db } from '../types';
import { ModelName } from '../models';
import { Transaction } from 'sequelize';

const MODEL_CREATE_ORDER: ModelName[] = ['User', 'UserSession'];

interface FixtureMap {
  User?: any[];
  UserSession?: any[];
}

export const createFixtures = async (
  db: Db,
  transaction: Transaction,
  fixtureMap: FixtureMap
) => {
  for (const modelName of MODEL_CREATE_ORDER) {
    const fixtures = fixtureMap[modelName] || [];
    for (const fixture of fixtures) {
      await db.models[modelName].create<any>(fixture, { transaction });
    }
  }
};
