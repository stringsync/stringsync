import { Config, getConfig } from '../config';
import { DeepPartial } from '../common';
import {
  SessionRequest,
  createGlobalCtx,
  createResolverCtx,
  GlobalCtx,
  ResolverCtx,
} from '../util/ctx';
import { Response } from 'express';
import { IGraphQLToolsResolveInfo } from 'graphql-tools';
import { merge } from 'lodash';
import { ForcedRollback } from '../data/db';
import { GraphQLResolveInfo } from 'graphql';

class ProviderForcedRollback extends ForcedRollback {
  constructor() {
    super();
    Object.setPrototypeOf(this, ProviderForcedRollback.prototype);
  }
}

type Patch = DeepPartial<{
  config: Config;
  req: SessionRequest;
  res: Response;
  info: IGraphQLToolsResolveInfo;
  src: any;
  args: Record<string, any>;
}> & { reqAt?: Date };

type Memo = Partial<{
  gctx: GlobalCtx;
  rctx: ResolverCtx;
  config: Config;
  req: SessionRequest;
  res: Response;
  info: GraphQLResolveInfo;
  src: any;
  args: any;
}>;

type Callback = (provider: Provider) => any;

export class Provider {
  public readonly patch: Patch;
  private memo: Memo = {};

  public static async run(patch: Patch, callback: Callback): Promise<void> {
    const provider = new Provider(patch);
    await provider.run(callback);
  }

  private constructor(patch: Patch) {
    this.patch = patch;
  }

  private async run(callback: Callback) {
    try {
      await this.gctx.db.transaction(async () => {
        await callback(this);
        throw new ProviderForcedRollback();
      });
    } catch (e) {
      if (!(e instanceof ProviderForcedRollback)) throw e;
    }
  }

  public get gctx() {
    if (this.memo.gctx) return this.memo.gctx;
    this.memo.gctx = createGlobalCtx(this.config);
    return this.memo.gctx;
  }

  public get rctx() {
    if (this.memo.rctx) return this.memo.rctx;
    const { reqAt } = this.patch;
    this.memo.rctx = createResolverCtx(this.gctx, this.req, this.res, reqAt);
    return this.memo.rctx;
  }

  public get config() {
    if (this.memo.config) return this.memo.config;
    const config = getConfig(process.env);
    this.memo.config = merge(config, this.patch.config) as Config;
    return this.memo.config;
  }

  public get req() {
    if (this.memo.req) return this.memo.req;
    this.memo.req = merge({}, this.patch.req) as SessionRequest;
    return this.memo.req;
  }

  public get res() {
    if (this.memo.res) return this.memo.res;
    this.memo.res = merge({}, this.patch.res) as Response;
    return this.memo.res;
  }

  public get info() {
    if (this.memo.info) return this.memo.info;
    this.memo.info = merge({}, this.patch.info) as IGraphQLToolsResolveInfo;
    return this.memo.info;
  }

  public get src() {
    // src can validly be undefined
    return this.patch.src;
  }

  public get args() {
    if (this.memo.args) return this.memo.args;
    this.memo.args = merge({}, this.patch.args);
    return this.memo.args;
  }
}
