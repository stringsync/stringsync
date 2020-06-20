import { gql } from './gql';

it('returns a joined template string', () => {
  const str = gql`query {}`;
  expect(str).toBe('query {}');
});
