/* eslint-disable react-hooks/rules-of-hooks */
import React, { useCallback, useEffect } from 'react';
import { Any$gql } from '../lib/graphql';
import { GqlRes, GqlStatus } from './useGql';

type ResHandler<T extends Any$gql, S extends GqlStatus> = (res: Extract<GqlRes<T>, { status: S }>) => void;

type DynamicGqlHandler = <T extends Any$gql, S extends GqlStatus>(
  status: S,
  res: GqlRes<T>,
  handler: ResHandler<T, S>,
  deps?: React.DependencyList
) => StaticEventHandlers;

type StaticGqlHandler<S extends GqlStatus> = <T extends Any$gql>(
  res: GqlRes<T>,
  handler: ResHandler<T, S>,
  deps?: React.DependencyList
) => StaticEventHandlers;

type StaticEventHandlers = {
  onInit: StaticGqlHandler<GqlStatus.Init>;
  onPending: StaticGqlHandler<GqlStatus.Pending>;
  onSuccess: StaticGqlHandler<GqlStatus.Success>;
  onErrors: StaticGqlHandler<GqlStatus.Errors>;
  onCancelled: StaticGqlHandler<GqlStatus.Cancelled>;
};

export type UseGqlHandler = DynamicGqlHandler & StaticEventHandlers;

export const useGqlHandler: UseGqlHandler = (status, res, handler, deps = []): StaticEventHandlers => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const callback = useCallback(handler, deps);
  useEffect(() => {
    if (res.status === status) {
      callback(res as Extract<typeof res, { status: typeof status }>);
    }
  }, [status, res, callback]);

  // allow for chaining
  return staticEventHandlers;
};

useGqlHandler.onInit = (res, handler, deps = []) => {
  return useGqlHandler(GqlStatus.Init, res, handler, deps);
};

useGqlHandler.onPending = (res, handler, deps = []) => {
  return useGqlHandler(GqlStatus.Pending, res, handler, deps);
};

useGqlHandler.onSuccess = (res, handler, deps = []) => {
  return useGqlHandler(GqlStatus.Success, res, handler, deps);
};

useGqlHandler.onErrors = (res, handler, deps = []) => {
  return useGqlHandler(GqlStatus.Errors, res, handler, deps);
};

useGqlHandler.onCancelled = (res, handler, deps = []) => {
  return useGqlHandler(GqlStatus.Cancelled, res, handler, deps);
};

const staticEventHandlers: StaticEventHandlers = {
  onInit: useGqlHandler.onInit,
  onPending: useGqlHandler.onPending,
  onSuccess: useGqlHandler.onSuccess,
  onErrors: useGqlHandler.onErrors,
  onCancelled: useGqlHandler.onCancelled,
};
