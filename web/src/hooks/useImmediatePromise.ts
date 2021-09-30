import { noop } from 'lodash';
import { useEffect } from 'react';
import { AsyncCallback, useAsyncCallback } from './useAsyncCallback';

export type CleanupCallback = (done: boolean) => void;

export const useImmediatePromise = <T>(callback: AsyncCallback<T>, onCleanup: CleanupCallback = noop) => {
  const [exec, promise] = useAsyncCallback(callback, onCleanup);

  useEffect(() => {
    exec();
  }, [exec]);

  return promise;
};
