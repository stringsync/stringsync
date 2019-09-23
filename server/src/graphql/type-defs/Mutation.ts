import { gql } from 'apollo-server';

export default gql`
  type Mutation {
    signup(input: SignupInput!): User!
    login(input: LoginInput!): User!
  }
`;
