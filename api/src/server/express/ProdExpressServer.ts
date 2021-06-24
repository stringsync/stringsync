import express from 'express';
import { GraphQLSchema } from 'graphql';
import { injectable } from 'inversify';
import path from 'path';
import { Server } from '../types';
import { ExpressServer } from './ExpressServer';

@injectable()
export class ProdExpressServer extends ExpressServer implements Server {
  start(schema: GraphQLSchema) {
    const { app } = this;

    this.configure(schema);

    app.use('/static', express.static(path.join(__dirname, 'static')));

    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'static', 'index.html'));
    });

    this.listen();
  }
}
