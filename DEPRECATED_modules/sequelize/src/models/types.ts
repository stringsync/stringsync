import { Model, BuildOptions } from 'sequelize';
import { UserModel } from './User';

export interface Models {
  User: UserModel;
}

export type StaticModel<M> = typeof Model & {
  new (values?: object, options?: BuildOptions): M;
  associate?: (models: StaticModels) => void;
};

export type StaticModels = {
  [M in keyof Models]: StaticModel<Models[M]>;
};
