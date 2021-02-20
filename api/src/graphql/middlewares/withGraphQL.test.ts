import { container } from '../../inversify.config';
import { generateSchema } from '../../resolvers';
import { withGraphQL } from './withGraphQL';

describe('withGraphQL', () => {
  it('runs without crashing', () => {
    const schema = generateSchema();
    expect(() => withGraphQL(container, schema)).not.toThrow();
  });
});
