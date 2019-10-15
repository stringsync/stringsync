import { FindOptions } from 'sequelize';
import { User } from 'common/types';

const DUMMY: User = {
  id: '',
  username: '',
  createdAt: new Date(),
  updatedAt: new Date(),
  email: '',
  role: 'student',
};

const attributes = Object.keys(DUMMY);

export const asUserPojo: FindOptions = Object.freeze({
  attributes,
  raw: true,
});
