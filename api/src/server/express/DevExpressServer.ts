import { altairExpress } from 'altair-express-middleware';
import { GraphQLSchema } from 'graphql';
import { injectable } from 'inversify';
import { Server } from '../types';
import { ExpressServer } from './ExpressServer';

@injectable()
export class DevExpressServer extends ExpressServer implements Server {
  start(schema: GraphQLSchema) {
    this.configure(schema);
    this.app.use('/altair', altairExpress({ endpointURL: '/graphql' }));
    this.listen();
  }
}
