import express from 'express';
import { Container, TYPES } from '@stringsync/container';
import { ContainerConfig } from '@stringsync/config';

if (require.main === module) {
  const config = Container.instance.get<ContainerConfig>(TYPES.ContainerConfig);
  const app = express();

  app.get('/', (req, res) => {
    res.send('ok');
  });

  app.listen(config.PORT);
}
