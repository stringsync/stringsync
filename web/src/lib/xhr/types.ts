export type ReqInit = Omit<RequestInit, 'signal'>;

export type Req = (input: RequestInfo, init?: ReqInit) => void;

export type Cancel = () => void;

export type Reset = () => void;

export type Parse<T> = (res: Response) => T | Promise<T>;

export enum Status {
  Init,
  Pending,
  Success,
  Error,
  Cancelled,
}

export type Res<T> =
  | { status: Status.Init }
  | { status: Status.Pending }
  | { status: Status.Success; result: T }
  | { status: Status.Error; error: Error }
  | { status: Status.Cancelled };
