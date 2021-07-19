import { GraphQLSchema } from 'graphql';
import { UserRole } from '../domain';
import { Job } from '../jobs';

export interface GraphqlServer {
  start(schema: GraphQLSchema): void;
}

export interface JobServer {
  start(jobs: Job<any>[]): void;
}

export type SessionUser = {
  id: string;
  role: UserRole;
  isLoggedIn: boolean;
};
