import { Db } from '../types';
import { Models, StaticModel } from '../models';

type ModelNames = keyof Models;

type FixtureMap = Partial<
  {
    [M in ModelNames]: any[];
  }
>;

type Model = Models[keyof Models];

const MODEL_CREATE_ORDER: ModelNames[] = ['User', 'UserSession'];

export const createFixtures = async (db: Db, fixtureMap: FixtureMap) => {
  for (const modelName of MODEL_CREATE_ORDER) {
    const fixtures = fixtureMap[modelName] || [];
    const model: StaticModel<Model> = db.models[modelName];
    await model.bulkCreate(fixtures);
  }
};
