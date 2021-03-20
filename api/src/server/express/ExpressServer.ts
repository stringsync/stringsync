import cors from 'cors';
import express from 'express';
import { GraphQLSchema } from 'graphql';
import { graphqlUploadExpress } from 'graphql-upload';
import { inject, injectable } from 'inversify';
import { RedisClient } from 'redis';
import { Config } from '../../config';
import { TYPES } from '../../inversify.constants';
import { AuthService } from '../../services';
import { Logger } from '../../util';
import { Server } from '../types';
import {
  withCtx,
  withErrorHandler,
  withGraphQL,
  withLogging,
  withSession,
  withSessionUser,
  withVersion,
} from './middlewares';

@injectable()
export class ExpressServer implements Server {
  protected app = express();

  constructor(
    @inject(TYPES.Logger) protected logger: Logger,
    @inject(TYPES.Config) protected config: Config,
    @inject(TYPES.Redis) protected redis: RedisClient,
    @inject(TYPES.AuthService) protected authService: AuthService
  ) {}

  start(schema: GraphQLSchema) {
    this.configure(schema);
    this.listen();
  }

  protected configure(schema: GraphQLSchema) {
    const { app, config, redis, authService } = this;

    app.set('trust proxy', 1);
    app.use(
      cors({ origin: [config.APP_WEB_ORIGIN], credentials: true }),
      withVersion,
      withCtx,
      withSession(redis, config),
      withSessionUser(authService),
      withLogging
    );

    app.get('/health', (req, res) => {
      res.send('ok');
    });

    app.use('/graphql', graphqlUploadExpress(), withGraphQL(schema));

    app.use(withErrorHandler);
  }

  protected listen() {
    const { app, logger, config } = this;
    app.listen(config.APP_GRAPHQL_PORT, () => {
      logger.info(`server running on port: ${config.APP_GRAPHQL_PORT}`);
    });
  }
}
