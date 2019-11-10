import { FixtureMap } from './types';
import { Db, Models, StaticModel } from '../db';

type Model = Models[keyof Models];

const MODEL_CREATE_ORDER: (keyof Models)[] = ['User', 'UserSession'];

export const createFixtures = async (db: Db, fixtureMap: FixtureMap) => {
  for (const modelName of MODEL_CREATE_ORDER) {
    const fixtures = fixtureMap[modelName] || [];
    const model: StaticModel<Model> = db.models[modelName];
    await model.bulkCreate(fixtures);
  }
};
