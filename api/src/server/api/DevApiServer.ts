import { altairExpress } from 'altair-express-middleware';
import { GraphQLSchema } from 'graphql';
import { injectable } from 'inversify';
import { GraphqlServer } from '../types';
import { ApiServer } from './ApiServer';

@injectable()
export class DevApiServer extends ApiServer implements GraphqlServer {
  start(schema: GraphQLSchema) {
    this.configure(schema);

    this.app.use('/altair', altairExpress({ endpointURL: '/graphql' }));

    this.listen();
  }
}
