import { GraphQLSchema } from 'graphql';
import { UserRole } from '../domain';

export interface Server {
  start(schema: GraphQLSchema): void;
}

export type SessionUser = {
  id: string;
  role: UserRole;
  isLoggedIn: boolean;
};
