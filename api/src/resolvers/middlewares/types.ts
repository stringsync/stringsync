import { NextFn, ResolverData } from 'type-graphql';

export type Predicate<T = {}> = (action: ResolverData<T>, next: NextFn) => Promise<boolean>;

export type Validator<T = {}> = (data: ResolverData<T>) => Promise<void>;
