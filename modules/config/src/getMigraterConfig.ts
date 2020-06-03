import { configFactory } from './configFactory';
import { ConfigKind } from './types';

export const getMigraterConfig = configFactory({
  DB_USERNAME: ConfigKind.STRING,
  DB_PASSWORD: ConfigKind.STRING,
  DB_HOST: ConfigKind.STRING,
  DB_PORT: ConfigKind.INT,
});

export type MigraterConfig = ReturnType<typeof getMigraterConfig>;
