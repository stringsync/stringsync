import * as domain from '@stringsync/domain';
import { User } from './User';
import { Resolver, Query } from 'type-graphql';

@Resolver()
export class UserResolver {
  @Query()
  async foo(): Promise<string> {
    return Promise.resolve('hello, world!');
  }
}
