import { Res, Status } from './types';

const isRes =
  <T, S extends Status>(status: S) =>
  (res: Res<T>): res is Extract<Res<T>, { status: S }> =>
    res.status === status;

export const isUnknown = isRes(Status.Unknown);
export const isIdle = isRes(Status.Idle);
export const isPending = isRes(Status.Pending);
export const isSuccess = isRes(Status.Success);
export const isError = isRes(Status.Error);
export const isCancelled = isRes(Status.Cancelled);
