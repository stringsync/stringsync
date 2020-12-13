import { ResolverData, NextFn } from 'type-graphql';
import { ReqCtx } from '../../ctx';

export type Predicate<T = ReqCtx> = (action: ResolverData<T>, next: NextFn) => Promise<boolean>;

export type Validator<T = ReqCtx> = (data: ResolverData<T>) => Promise<void>;
