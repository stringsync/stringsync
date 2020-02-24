import { gql } from 'apollo-boost';

export const GET_CSRF_TOKEN_QUERY = gql`
  query {
    getCsrfToken
  }
`;
