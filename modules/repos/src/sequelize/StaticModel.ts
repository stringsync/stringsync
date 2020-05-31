import { Model, BuildOptions } from 'sequelize';
import { UserModel } from './user';

export interface Models {
  User: UserModel;
}

export type StaticModels = {
  [M in keyof Models]: StaticModel<Models[M]>;
};

export type StaticModel<M> = typeof Model & {
  new (values?: object, options?: BuildOptions): M;
  associate?: (models: StaticModels) => void;
};