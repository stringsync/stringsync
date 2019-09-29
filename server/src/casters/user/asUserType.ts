import { FindOptions } from 'sequelize';

export const asUserType: FindOptions = Object.freeze({
  attributes: ['id', 'username', 'email', 'createdAt', 'updatedAt'],
  raw: true,
});
