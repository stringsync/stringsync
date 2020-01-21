import { getServer } from './getServer';
import { useTestDb } from '../testing';
import { getSchema } from '../resolvers';
import { createLogger } from 'winston';
import { getConfig } from '../config';

it(
  'runs without crashing',
  useTestDb({}, async (db) => {
    const schema = getSchema();
    const logger = createLogger();
    const config = getConfig(process.env);
    expect(() => getServer(db, schema, logger, config)).not.toThrow();
  })
);
