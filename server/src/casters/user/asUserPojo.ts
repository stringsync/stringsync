import { FindOptions } from 'sequelize';

export const asUserPojo: FindOptions = Object.freeze({
  attributes: ['id', 'username', 'email', 'createdAt', 'updatedAt'],
  raw: true,
});
