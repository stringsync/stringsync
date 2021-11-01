import { injectable } from 'inversify';
import { Query, Resolver } from 'type-graphql';
import { APP_VERSION } from '../../util';

@Resolver()
@injectable()
export class MetaResolver {
  @Query((returns) => String)
  async health(): Promise<string> {
    return 'ok';
  }

  @Query((returns) => String)
  async version(): Promise<string> {
    return APP_VERSION;
  }
}
