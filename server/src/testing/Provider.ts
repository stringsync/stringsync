import { Config, getConfig } from '../config';
import { DeepPartial } from '../common';
import {
  SessionRequest,
  createGlobalCtx,
  createResolverCtx,
} from '../util/ctx';
import { Response } from 'express';
import { IGraphQLToolsResolveInfo } from 'graphql-tools';
import { merge } from 'lodash';
import { ForcedRollback } from '../data/db';
import { memoize } from '../util/memoize';

type Patch = DeepPartial<{
  config: Config;
  req: SessionRequest;
  reqAt: Date;
  res: Response;
  info: IGraphQLToolsResolveInfo;
}>;

type Callback = (provider: Provider) => any;

class ProviderForcedRollback extends ForcedRollback {
  constructor() {
    super();
    Object.setPrototypeOf(this, ProviderForcedRollback.prototype);
  }
}

/**
 * Provides easy access to resources for testing.
 *
 * Example usage:
 *
 * Provider.run({}, async (p) => {
 *   const ctx = p.gctx; // globalCtx
 *   const user = await createUser(ctx.db);
 *   expect(user).not.toBeNull();
 * });
 */
export class Provider {
  public readonly patch: Patch;

  public static async run(patch: Patch, callback: Callback): Promise<void> {
    const provider = new Provider(patch);
    await provider.run(callback);
  }

  private constructor(patch: Patch) {
    this.patch = patch;
  }

  private async run(callback: Callback) {
    await this.gctx.db.transaction(async () => {
      try {
        await callback(this);
        throw new ProviderForcedRollback();
      } catch (e) {
        await this.cleanup();
        if (!(e instanceof ProviderForcedRollback)) throw e;
      }
    });
  }

  @memoize()
  public get gctx() {
    return createGlobalCtx(this.config);
  }

  @memoize()
  public get rctx() {
    return createResolverCtx(this.gctx, this.req, this.res);
  }

  @memoize()
  public get config() {
    const config = getConfig(process.env);
    return merge(config, this.patch.config);
  }

  @memoize()
  public get req() {
    return merge({}, this.patch.req) as SessionRequest;
  }

  @memoize()
  public get res() {
    return merge({}, this.patch.res) as Response;
  }

  @memoize()
  public get info() {
    return merge({}, this.patch.info) as IGraphQLToolsResolveInfo;
  }

  private async cleanup() {
    await this.gctx.db.sequelize.close();

    const queues = Object.values(this.gctx.queues);
    await Promise.all(queues.map((queue) => queue.close()));

    await this.gctx.redis.quit();
  }
}
