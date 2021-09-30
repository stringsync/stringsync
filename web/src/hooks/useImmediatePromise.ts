import { noop } from 'lodash';
import { useEffect } from 'react';
import { AsyncCallback, usePromiseExec } from './usePromiseExec';

export type CleanupCallback = (done: boolean) => void;

export const useImmediatePromise = <T>(callback: AsyncCallback<T>, onCleanup: CleanupCallback = noop) => {
  const [exec, promise] = usePromiseExec(callback, onCleanup);

  useEffect(() => {
    exec();
  }, [exec]);

  return promise;
};
