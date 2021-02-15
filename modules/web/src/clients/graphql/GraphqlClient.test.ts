import { gql } from './../gql';
import { GraphqlClient } from './GraphqlClient';

describe('GraphqlClient', () => {
  it('makes graphql requests', async () => {
    const query = gql`
      query($input: Input) {
        foo(input: $input)
      }
    `;
    const variables = { input: 'blah' };
    const uri = 'uri';
    const fetchSpy = jest.spyOn(window, 'fetch');
    fetchSpy.mockResolvedValue({ json: jest.fn().mockResolvedValue({ secret: 'secret' }) } as any);

    const graphqlClient = new GraphqlClient(uri);

    const res = await graphqlClient.call(query, variables);

    expect(res).toStrictEqual({ secret: 'secret' });
  });
});
