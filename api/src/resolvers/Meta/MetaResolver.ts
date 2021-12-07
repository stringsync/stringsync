import { inject, injectable } from 'inversify';
import { Query, Resolver } from 'type-graphql';
import { TYPES } from '../../inversify.constants';
import { HealthCheckerService } from '../../services';
import { APP_VERSION } from '../../util';
import { HealthResult } from './HealthResult';

@Resolver()
@injectable()
export class MetaResolver {
  constructor(@inject(TYPES.HealthCheckerService) private healthCheckerService: HealthCheckerService) {}

  @Query((returns) => HealthResult)
  async health(): Promise<HealthResult> {
    return await this.healthCheckerService.checkHealth();
  }

  @Query((returns) => String)
  async version(): Promise<string> {
    return APP_VERSION;
  }
}
