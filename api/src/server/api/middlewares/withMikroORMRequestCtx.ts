import { RequestContext } from '@mikro-orm/core';
import { Handler } from 'express';
import { Db, isMikroORMDb } from '../../../db';
import { InternalError } from '../../../errors';

export const withMikroORMRequestCtx = (db: Db): Handler => {
  if (!isMikroORMDb(db)) {
    throw new InternalError('MikroORM Db must be used with this middleware');
  }
  return (req, res, next) => {
    RequestContext.create(db.em, next);
  };
};
