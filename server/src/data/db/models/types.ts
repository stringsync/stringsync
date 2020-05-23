import { Model, BuildOptions } from 'sequelize';
import { UserModel } from './user';
import { UserSessionModel } from './user-session';

export interface Models {
  User: UserModel;
  UserSession: UserSessionModel;
}

export type StaticModel<M> = typeof Model & {
  new (values?: object, options?: BuildOptions): M;
  associate?: (models: StaticModels) => void;
};

export type StaticModels = {
  [M in keyof Models]: StaticModel<Models[M]>;
};
