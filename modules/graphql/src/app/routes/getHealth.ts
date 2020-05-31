import { Db } from '@stringsync/repos';
import { Container } from 'inversify';
import { Handler } from 'express';
import { TYPES } from '../../container';
import { Redis } from 'ioredis';

export const getHealth = (container: Container): Handler => async (req, res) => {
  const db = container.get<Db>(TYPES.Db);
  await db.sequelize.authenticate();

  const redis = container.get<Redis>(TYPES.Redis);
  await redis.time();

  res.send('ok');
};
