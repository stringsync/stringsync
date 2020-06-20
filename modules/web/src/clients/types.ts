import { GraphqlClient } from './graphql/GraphqlClient';
import { AuthClient } from './auth/AuthClient';

export type Clients = {
  graphqlClient: GraphqlClient;
  authClient: AuthClient;
};
