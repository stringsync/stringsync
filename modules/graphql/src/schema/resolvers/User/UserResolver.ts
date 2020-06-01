import { Resolver, Query } from 'type-graphql';
import { injectable } from 'inversify';

@Resolver()
@injectable()
export class UserResolver {
  @Query()
  foo(): string {
    return 'hello, world!';
  }
}
