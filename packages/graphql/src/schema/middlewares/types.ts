import { ResolverData, NextFn } from 'type-graphql';

export type Predicate<T = {}> = (action: ResolverData<T>, next: NextFn) => Promise<boolean>;
