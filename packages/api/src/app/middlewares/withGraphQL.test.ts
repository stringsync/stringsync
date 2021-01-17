import { useTestContainer } from '@stringsync/di';
import { API } from '../../API';
import { generateSchema } from '../../schema';
import { withGraphQL } from './withGraphQL';

describe('withGraphQL', () => {
  const ref = useTestContainer(API);

  it('runs without crashing', () => {
    const schema = generateSchema();
    expect(() => withGraphQL(ref.container, schema)).not.toThrow();
  });
});
