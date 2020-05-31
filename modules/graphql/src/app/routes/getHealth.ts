import { Db } from '@stringsync/repos';
import { Container } from 'inversify';
import { Handler } from 'express';
import { TYPES } from '../../container';

export const getHealth = (container: Container): Handler => async (req, res) => {
  const db = container.get<Db>(TYPES.Db);
  await db.sequelize.authenticate();
  res.send('ok');
};
