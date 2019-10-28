import { DbAccessor } from '../types';
import { ModelName } from '../models';

const MODEL_CREATE_ORDER: ModelName[] = ['User', 'UserSession'];

interface FixtureMap {
  User?: any[];
  UserSession?: any[];
}

export const createFixtures: DbAccessor<void, FixtureMap> = async (
  db,
  transaction,
  fixtureMap
) => {
  for (const modelName of MODEL_CREATE_ORDER) {
    const fixtures = fixtureMap[modelName] || [];
    for (const fixture of fixtures) {
      await db.models[modelName].create<any>(fixture, { transaction });
    }
  }
};
