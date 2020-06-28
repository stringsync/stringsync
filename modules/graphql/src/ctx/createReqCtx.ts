import { TYPES } from '@stringsync/container';
import { ReqCtx } from './types';
import { Container } from 'inversify';
import { Request, Response } from 'express';
import * as uuid from 'uuid';

const bindAsSingleton = <T>(container: Container, identifier: symbol) => {
  const instance: T = container.get<T>(identifier);
  container.bind<T>(identifier).toConstantValue(instance);
};

export const createReqCtx = (req: Request, res: Response, parent: Container): ReqCtx => {
  const reqAt = new Date();
  const reqId = uuid.v4();
  const container = parent.createChild();

  bindAsSingleton(container, TYPES.UserService);
  bindAsSingleton(container, TYPES.NotationService);
  bindAsSingleton(container, TYPES.TagService);

  return { reqAt, reqId, req, res, container };
};
