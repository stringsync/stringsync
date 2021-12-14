import { inject, injectable } from 'inversify';
import { Query, Resolver } from 'type-graphql';
import { TYPES } from '../../inversify.constants';
import { HealthCheckerService } from '../../services';
import { APP_VERSION } from '../../util';
import * as types from '../graphqlTypes';

@Resolver()
@injectable()
export class MetaResolver {
  constructor(@inject(TYPES.HealthCheckerService) private healthCheckerService: HealthCheckerService) {}

  @Query((returns) => types.Health)
  async health(): Promise<types.Health> {
    return await this.healthCheckerService.checkHealth();
  }

  @Query((returns) => String)
  async version(): Promise<string> {
    return APP_VERSION;
  }
}
