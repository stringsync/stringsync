import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  HttpLink,
} from 'apollo-boost';
import { AUTH_JWT_KEY } from '../store/modules/auth';

const uri = process.env.REACT_APP_SERVER_URI;

const createApolloClient = () => {
  const cache = new InMemoryCache();
  const httpLink = new HttpLink({ uri });
  const authLink = new ApolloLink((operation, next) => {
    const jwt = window.localStorage.getItem(AUTH_JWT_KEY);

    if (jwt) {
      operation.setContext({
        headers: {
          authorization: jwt,
        },
      });
    }

    return next(operation);
  });

  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache,
  });
};

export default createApolloClient;
