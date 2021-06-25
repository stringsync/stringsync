import express from 'express';
import { GraphQLSchema } from 'graphql';
import { injectable } from 'inversify';
import path from 'path';
import { Server } from '../types';
import { ExpressServer } from './ExpressServer';

const WEB_DIR = path.join(__dirname, '..', 'web');
const STATIC_DIR = path.join(WEB_DIR, 'static');
const INDEX_FILE = path.join(WEB_DIR, 'index.html');

@injectable()
export class ProdExpressServer extends ExpressServer implements Server {
  start(schema: GraphQLSchema) {
    const { app } = this;

    this.configure(schema);

    app.use('/static', express.static(STATIC_DIR));

    app.use('/', express.static(WEB_DIR));

    app.get('*', (req, res) => {
      res.sendFile(INDEX_FILE);
    });

    this.listen();
  }
}
