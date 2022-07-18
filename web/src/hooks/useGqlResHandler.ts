/* eslint-disable react-hooks/rules-of-hooks */
import React, { useCallback, useEffect } from 'react';
import { Any$gql } from '../lib/graphql';
import { GqlRes, GqlStatus } from './useGql2';

type ResHandler<T extends Any$gql, S extends GqlStatus> = (res: Extract<GqlRes<T>, { status: S }>) => void;

type DynamicGqlHandler = <T extends Any$gql, S extends GqlStatus>(
  status: S,
  res: GqlRes<T>,
  handler: ResHandler<T, S>,
  deps?: React.DependencyList
) => void;

type StaticGqlHandler<S extends GqlStatus> = <T extends Any$gql>(
  res: GqlRes<T>,
  handler: ResHandler<T, S>,
  deps?: React.DependencyList
) => void;

export type UseGqlResHandler = DynamicGqlHandler & {
  onInit: StaticGqlHandler<GqlStatus.Init>;
  onPending: StaticGqlHandler<GqlStatus.Pending>;
  onSuccess: StaticGqlHandler<GqlStatus.Success>;
  onError: StaticGqlHandler<GqlStatus.Error>;
  onCancelled: StaticGqlHandler<GqlStatus.Cancelled>;
};

export const useGqlResHandler: UseGqlResHandler = (status, res, handler, deps = []) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const callback = useCallback(handler, deps);
  useEffect(() => {
    if (res.status === status) {
      callback(res as Extract<typeof res, { status: typeof status }>);
    }
  }, [status, res, callback]);
};

useGqlResHandler.onInit = (res, handler, deps = []) => {
  return useGqlResHandler(GqlStatus.Init, res, handler, deps);
};

useGqlResHandler.onPending = <T extends Any$gql>(
  res: GqlRes<T>,
  handler: ResHandler<T, GqlStatus.Pending>,
  deps: React.DependencyList = []
) => useGqlResHandler(GqlStatus.Pending, res, handler, deps);

useGqlResHandler.onSuccess = <T extends Any$gql>(
  res: GqlRes<T>,
  handler: ResHandler<T, GqlStatus.Success>,
  deps: React.DependencyList = []
) => useGqlResHandler(GqlStatus.Success, res, handler, deps);

useGqlResHandler.onError = <T extends Any$gql>(
  res: GqlRes<T>,
  handler: ResHandler<T, GqlStatus.Error>,
  deps: React.DependencyList = []
) => useGqlResHandler(GqlStatus.Error, res, handler, deps);

useGqlResHandler.onCancelled = <T extends Any$gql>(
  res: GqlRes<T>,
  handler: ResHandler<T, GqlStatus.Cancelled>,
  deps: React.DependencyList = []
) => useGqlResHandler(GqlStatus.Cancelled, res, handler, deps);
