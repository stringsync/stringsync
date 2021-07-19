import { GraphQLSchema } from 'graphql';
import { UserRole } from '../domain';

export interface GraphqlServer {
  start(schema: GraphQLSchema): void;
}

export interface Server {
  start(): void;
}

export type SessionUser = {
  id: string;
  role: UserRole;
  isLoggedIn: boolean;
};
