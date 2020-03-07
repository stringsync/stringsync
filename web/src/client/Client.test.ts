import { Client } from './Client';
import { gql, NetworkStatus } from 'apollo-boost';

const QUERY = gql`
  query {
    foo {
      bar
    }
  }
`;

const MUTATION = gql`
  mutation {
    foo {
      bar
    }
  }
`;

const VARIABLES = {
  input: {
    variable1: 'val1',
    variable2: 'val2',
  },
};

const RES = {
  data: {},
  loading: false,
  networkStatus: NetworkStatus.ready,
  stale: false,
};

it('executes a query', async () => {
  const client = Client.create(Client.TEST_URI);

  const querySpy = jest.spyOn(client.apollo, 'query').mockResolvedValue(RES);

  await client.call(QUERY, VARIABLES);

  expect(querySpy).toHaveBeenCalledTimes(1);
  expect(querySpy).toHaveBeenCalledWith({ query: QUERY, variables: VARIABLES });
});

it('executes a mutation', async () => {
  const client = Client.create(Client.TEST_URI);

  const querySpy = jest.spyOn(client.apollo, 'mutate').mockResolvedValue(RES);

  await client.call(MUTATION, VARIABLES);

  expect(querySpy).toHaveBeenCalledTimes(1);
  expect(querySpy).toHaveBeenCalledWith({
    mutation: MUTATION,
    variables: VARIABLES,
  });
});
