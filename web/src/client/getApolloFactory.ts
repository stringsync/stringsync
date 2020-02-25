// import { CSRF_HEADER_NAME } from 'common/constants';
import { CsrfTokenSetter } from './types';
import {
  ApolloClient as Apollo,
  HttpLink,
  ApolloLink,
  InMemoryCache,
} from 'apollo-boost';

export const getApolloFactory = () => {
  // a closure is used to store the csrfToken
  // to mitigate it from being stolen
  let csrfToken: string = '';
  const setCsrfToken: CsrfTokenSetter = (nextCsrfToken: string): void => {
    csrfToken = nextCsrfToken;
  };

  return (uri: string) => {
    const csrfLink = new ApolloLink((req, next) => {
      req.setContext({
        headers: {
          'CSRF-TOKEN': csrfToken,
        },
      });

      return next(req);
    });

    const httpLink = new HttpLink({
      uri,
      credentials: 'include',
    });

    const link = csrfLink.concat(httpLink);
    const cache = new InMemoryCache();
    const apollo = new Apollo({ link, cache });
    return { apollo, setCsrfToken };
  };
};
