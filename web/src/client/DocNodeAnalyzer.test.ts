import { DocNodeAnalyzer } from './DocNodeAnalyzer';
import { gql } from 'apollo-boost';

it('identifies queries', () => {
  const operationType = DocNodeAnalyzer.getOperationType(gql`
    query {
      foo
    }
  `);

  expect(operationType).toBe('query');
});

it('identifies mutations', () => {
  const operationType = DocNodeAnalyzer.getOperationType(gql`
    mutation {
      foo
    }
  `);

  expect(operationType).toBe('mutation');
});
