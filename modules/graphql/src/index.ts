import 'reflect-metadata';
import { GraphqlConfig } from '@stringsync/config';
import { getContainer } from './container';
import { TYPES } from '@stringsync/common';
import { getApp } from './app';

const container = getContainer();
const app = getApp(container);
const config = container.get<GraphqlConfig>(TYPES.GraphqlConfig);

app.listen(config.PORT, () => {
  console.log(`running at http://localhost:${config.PORT}`);
});
