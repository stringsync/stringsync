import express from 'express';
import { GraphQLSchema } from 'graphql';
import { graphqlUploadExpress } from 'graphql-upload';
import { inject, injectable } from 'inversify';
import { RedisClient } from 'redis';
import { Config } from '../../config';
import { Db } from '../../db';
import { TYPES } from '../../inversify.constants';
import { AuthService } from '../../services';
import { Logger } from '../../util';
import { GraphqlServer } from '../types';
import {
  withCors,
  withCtx,
  withErrorHandler,
  withGraphQL,
  withLogging,
  withMikroORMRequestCtx,
  withSession,
  withSessionUser,
  withVersion,
} from './middlewares';

@injectable()
export class ApiServer implements GraphqlServer {
  protected app = express();

  constructor(
    @inject(TYPES.Logger) protected logger: Logger,
    @inject(TYPES.Config) protected config: Config,
    @inject(TYPES.Redis) protected redis: RedisClient,
    @inject(TYPES.AuthService) protected authService: AuthService,
    @inject(TYPES.Db) protected db: Db
  ) {}

  start(schema: GraphQLSchema) {
    this.configure(schema);
    this.listen();
  }

  protected configure(schema: GraphQLSchema) {
    const { app, config, redis, db, authService } = this;

    app.set('trust proxy', () => true);
    app.use(
      withCors(config),
      withVersion,
      withMikroORMRequestCtx(db),
      withCtx,
      withSession(redis, config),
      withSessionUser(authService),
      withLogging
    );

    app.get('/health', (req, res) => {
      res.send('ok');
    });

    app.use('/graphql', graphqlUploadExpress(), withGraphQL(this.logger, schema));

    app.use(withErrorHandler);
  }

  protected listen() {
    const { app, logger, config } = this;
    app.listen(config.PORT, () => {
      logger.info(`server running on port: ${config.PORT}`);
    });
  }
}
