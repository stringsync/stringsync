import React, { useCallback, useEffect } from 'react';
import * as xhr from '../lib/xhr';

export type ResHandler<T, S extends xhr.Status> = (res: Extract<xhr.Res<T>, { status: S }>) => void;

export const useResHandler = <T, S extends xhr.Status>(
  status: S,
  res: xhr.Res<T>,
  handler: ResHandler<T, S>,
  deps: React.DependencyList = []
) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const callback = useCallback(handler, deps);

  useEffect(() => {
    if (res.status === status) {
      callback(res as Extract<xhr.Res<T>, { status: S }>);
    }
  }, [status, res, callback]);
};
