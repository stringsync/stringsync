import { Resolver } from '../';
import { ResolverCtx } from '../../util/ctx';

export type Middleware<
  R = any,
  S = undefined,
  A = Record<string, any>,
  C = ResolverCtx
> = (next: Resolver<R, S, A, C>) => Resolver<R, S, A, C>;

export type Predicate<
  S = undefined,
  A = Record<string, any>,
  C = ResolverCtx
> = Resolver<Promise<boolean> | boolean, S, A, C>;
