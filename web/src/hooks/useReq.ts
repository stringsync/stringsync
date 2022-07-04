import { noop } from 'lodash';
import { useCallback, useEffect, useRef, useState } from 'react';

export type Parser<T> = (res: Response) => T | Promise<T>;

export type Req = () => void;

export enum ResStatus {
  Unknown = 'Unknown',
  Idle = 'Idle',
  Pending = 'Pending',
  Success = 'Success',
  Error = 'Error',
  Cancelled = 'Cancelled',
}

export type Res<T> =
  | { status: ResStatus.Idle }
  | { status: ResStatus.Pending }
  | { status: ResStatus.Success; result: T }
  | { status: ResStatus.Error; error: any }
  | { status: ResStatus.Cancelled };

export type Canceller = () => void;

enum CancelType {
  None,
  Internal,
  External,
  Supplant,
}

export const useReq = <T>(
  parse: Parser<T>,
  input: RequestInfo,
  init?: Omit<RequestInit, 'signal'>
): [req: Req, res: Res<T>, cancel: Canceller] => {
  const [res, setRes] = useState<Res<T>>(() => ({ status: ResStatus.Idle }));
  const externalCancelRef = useRef<Canceller>(noop);
  const internalCancelRef = useRef<Canceller>(noop);
  const supplantCancelRef = useRef<Canceller>(noop);

  // If any of the args change, cancel the res so that any stale in-flight requests don't get erroneously applied.
  useEffect(() => {
    internalCancelRef.current();
  }, [parse, input, init]);

  const req = useCallback(() => {
    supplantCancelRef.current();

    let done = false;
    setRes({ status: ResStatus.Pending });

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
          setRes({ status: ResStatus.Cancelled });
        } else {
          setRes({ status: ResStatus.Success, result: parsed });
        }
      })
      .catch((error) => {
        if (done) {
          return;
        } else if (cancelled && cancelType === CancelType.Internal) {
          setRes({ status: ResStatus.Idle });
        } else if (cancelled && cancelType === CancelType.External) {
          setRes({ status: ResStatus.Cancelled });
        } else if (cancelled && cancelType === CancelType.Supplant) {
          // The supplanted call will handle state changes.
          return;
        } else {
          setRes({ status: ResStatus.Error, error });
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
