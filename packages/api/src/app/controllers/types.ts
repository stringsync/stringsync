import { RequestHandler } from 'express';

export interface Controller {
  get?: RequestHandler;
  post?: RequestHandler;
  put?: RequestHandler;
  patch?: RequestHandler;
  delete?: RequestHandler;
}
