import { ApolloClient, InMemoryCache, HttpLink } from 'apollo-boost';

const uri = process.env.REACT_APP_SERVER_URI;

const createApolloClient = () => {
  const cache = new InMemoryCache();
  const httpLink = new HttpLink({
    uri,
    credentials: 'include',
  });
  return new ApolloClient({
    link: httpLink,
    cache,
  });
};

export default createApolloClient;
