import { useCallback, useEffect } from 'react';
import { Any$gql } from '../lib/graphql';
import { GqlRes, GqlStatus } from './useGql2';

export type ResHandler<T extends Any$gql, S extends GqlStatus> = (res: Extract<GqlRes<T>, { status: S }>) => void;

export const useResHandler = <T extends Any$gql, S extends GqlStatus>(
  status: S,
  res: GqlRes<T>,
  handler: ResHandler<T, S>,
  deps: React.DependencyList = []
) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const callback = useCallback(handler, deps);

  useEffect(() => {
    if (res.status === status) {
      callback(res as Extract<GqlRes<T>, { status: S }>);
    }
  }, [status, res, callback]);
};
