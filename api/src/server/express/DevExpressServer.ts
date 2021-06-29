import { altairExpress } from 'altair-express-middleware';
import { GraphQLSchema } from 'graphql';
import http from 'http';
import httpProxy from 'http-proxy';
import { injectable } from 'inversify';
import { Server } from '../types';
import { ExpressServer } from './ExpressServer';

const PROXY_TARGET = 'http://web:3001';

@injectable()
export class DevExpressServer extends ExpressServer implements Server {
  start(schema: GraphQLSchema) {
    this.configure(schema);

    this.app.use('/altair', altairExpress({ endpointURL: '/graphql' }));

    const webProxy = httpProxy.createProxyServer();

    this.app.get('/static', async (req, res) => {
      webProxy.web(req, res, { target: PROXY_TARGET });
    });

    this.app.all('/*', async (req, res) => {
      webProxy.web(req, res, { target: PROXY_TARGET });
    });

    const server = http.createServer(this.app);

    server.on('upgrade', (req, socket, head) => {
      webProxy.ws(req, socket, head, { target: PROXY_TARGET });
    });

    server.listen(this.config.APP_GRAPHQL_PORT);
  }
}
