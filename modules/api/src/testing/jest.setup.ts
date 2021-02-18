import { Db } from '../db';
import { container } from '../inversify.config';
import { TYPES } from '../inversify.constants';
import { toHaveErrorCode } from './matchers';

expect.extend({
  toHaveErrorCode,
});

// init DB
container.get<Db>(TYPES.Db);
