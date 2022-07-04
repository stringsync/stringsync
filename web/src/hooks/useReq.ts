import { noop } from 'lodash';
import { useCallback, useEffect, useRef, useState } from 'react';
import * as xhr from '../lib/xhr';

enum CancelType {
  None,
  Internal,
  External,
  Supplant,
}

export const useReq = <T>(
  parse: xhr.Parse<T>,
  input: RequestInfo,
  init?: Omit<RequestInit, 'signal'>
): [req: xhr.Req, res: xhr.Res<T>, cancel: xhr.Cancel] => {
  const [res, setRes] = useState<xhr.Res<T>>(() => ({ status: xhr.Status.Idle }));
  const externalCancelRef = useRef<xhr.Cancel>(noop);
  const internalCancelRef = useRef<xhr.Cancel>(noop);
  const supplantCancelRef = useRef<xhr.Cancel>(noop);

  // If any of the args change, cancel the res so that any stale in-flight requests don't get erroneously applied.
  useEffect(() => {
    internalCancelRef.current();
  }, [parse, input, init]);

  const req = useCallback(() => {
    supplantCancelRef.current();

    let done = false;
    setRes({ status: xhr.Status.Pending });

    // We communicate via memory because the AbortController API does not offer a way to pass messages via
    // AbortController.prototype.abort. In other words, without these variables, we have no way to tell if the
    // AbortController.prototype.abort call was triggered internally or externally.
    let cancelled = false;
    let cancelType = CancelType.None;
    const abortController = new AbortController();
    const cancel = (nextCancelType: CancelType) => () => {
      if (!cancelled && !done) {
        cancelled = true;
        cancelType = nextCancelType;
        abortController.abort();
      }
    };
    internalCancelRef.current = cancel(CancelType.Internal);
    externalCancelRef.current = cancel(CancelType.External);
    supplantCancelRef.current = cancel(CancelType.Supplant);

    fetch(input, { ...init, signal: abortController.signal })
      .then(parse)
      .then((parsed) => {
        if (cancelled) {
          setRes({ status: xhr.Status.Cancelled });
        } else {
          setRes({ status: xhr.Status.Success, result: parsed });
        }
      })
      .catch((error) => {
        if (done) {
          return;
        } else if (cancelled && cancelType === CancelType.Internal) {
          setRes({ status: xhr.Status.Idle });
        } else if (cancelled && cancelType === CancelType.External) {
          setRes({ status: xhr.Status.Cancelled });
        } else if (cancelled && cancelType === CancelType.Supplant) {
          // The supplanted call will handle state changes.
          return;
        } else {
          setRes({ status: xhr.Status.Error, error });
        }
      })
      .finally(() => {
        done = true;
      });
  }, [parse, input, init]);

  const cancel = useCallback(() => {
    externalCancelRef.current();
  }, []);

  return [req, res, cancel];
};
