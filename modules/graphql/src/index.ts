import 'reflect-metadata';
import { Config } from './config';
import { getContainer } from './container';
import { TYPES } from '@stringsync/common';
import { getApp } from './app';

const container = getContainer();
const app = getApp(container);
const config = container.get<Config>(TYPES.Config);

app.listen(config.PORT, () => {
  console.log(`running at http://localhost:${config.PORT}`);
});
