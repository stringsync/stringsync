import { container } from '../../../inversify.config';
import { TYPES } from '../../../inversify.constants';
import { generateSchema } from '../../../resolvers';
import { Logger } from '../../../util';
import { withGraphQL } from './withGraphQL';

describe('withGraphQL', () => {
  it('runs without crashing', () => {
    const logger = container.get<Logger>(TYPES.Logger);
    const schema = generateSchema();
    expect(() => withGraphQL(logger, schema)).not.toThrow();
  });
});
