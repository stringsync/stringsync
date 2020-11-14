import { ContainerConfig } from '@stringsync/config';
import { TYPES } from '@stringsync/di';
import { altairExpress } from 'altair-express-middleware';
import cors from 'cors';
import express from 'express';
import { GraphQLSchema } from 'graphql';
import { graphqlUploadExpress } from 'graphql-upload';
import { Container } from 'inversify';
import { HealthController } from './controllers';
import { withGraphQL, withSession } from './middlewares';
import { withSessionUser } from './middlewares/withSessionUser';

export const app = (container: Container, schema: GraphQLSchema) => {
  const app = express();
  const healthController = container.get<HealthController>(TYPES.HealthController);
  const config = container.get<ContainerConfig>(TYPES.ContainerConfig);

  app.set('trust proxy', 1);

  app.use(cors({ origin: [config.APP_WEB_URI], credentials: true }));

  app.get('/health', healthController.get);

  app.use(
    '/graphql',
    withSession(container),
    withSessionUser(container),
    graphqlUploadExpress(),
    withGraphQL(container, schema)
  );

  if (config.NODE_ENV === 'development') {
    app.use(
      '/altair',
      altairExpress({
        endpointURL: '/graphql',
      })
    );
  }

  return app;
};
