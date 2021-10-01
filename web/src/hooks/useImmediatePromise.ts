import { noop } from 'lodash';
import { useEffect } from 'react';
import { AsyncCallback, CancelCallback, useAsync } from './useAsync';
import { useMemoCmp } from './useMemoCmp';

export const useImmediatePromise = <T, A extends any[]>(
  callback: AsyncCallback<T, A>,
  args: A,
  onCancel: CancelCallback = noop
) => {
  args = useMemoCmp(args);
  const [invokeCallback, promise] = useAsync(callback, onCancel);
  useEffect(() => {
    invokeCallback(...args);
  }, [invokeCallback, args]);
  return promise;
};
