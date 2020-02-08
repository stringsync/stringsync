import { getServer } from './getServer';
import { useTestDb } from '../testing';
import { getSchema } from '../resolvers';
import { createLogger } from 'winston';
import { getConfig } from '../config';
import { connectToRedis } from '../redis';

it(
  'runs without crashing',
  useTestDb({}, async (db) => {
    const schema = getSchema();
    const logger = createLogger();
    const config = getConfig(process.env);
    const redis = connectToRedis(config);
    expect(() => getServer(db, schema, logger, redis, config)).not.toThrow();
  })
);
