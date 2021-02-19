import { injectable } from 'inversify';
import { Query, Resolver, UseMiddleware } from 'type-graphql';
import { AuthRequirement } from '../../../auth';
import { WithAuthRequirement } from '../middlewares';

@Resolver()
@injectable()
export class ExperimentResolver {
  @Query((returns) => String, { nullable: true })
  @UseMiddleware(WithAuthRequirement(AuthRequirement.LOGGED_IN_AS_ADMIN))
  async health(): Promise<string> {
    return 'ok';
  }
}
