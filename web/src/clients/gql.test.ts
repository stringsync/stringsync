import { gql } from './gql';

describe('gql', () => {
  it('returns a joined template string', () => {
    const str = gql`query {}`;
    expect(str).toBe('query {}');
  });
});
