import React, { useMemo } from 'react';
import { Any$gql } from '../lib/graphql';
import { GqlRes, GqlStatus } from './useGql';

type ResHandler<T extends Any$gql, S extends GqlStatus> = (res: Extract<GqlRes<T>, { status: S }>) => void;

export const useGqlHandler2 = <T extends Any$gql>(res: GqlRes<T>, deps: React.DependencyList = []) => {
  return useMemo(() => {}, [res, ...deps]);
};
