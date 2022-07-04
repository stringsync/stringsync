export type ReqInit = Omit<RequestInit, 'signal'>;

export type Req = (input: RequestInfo, init?: ReqInit) => void;

export type Cancel = () => void;

export type Parse<T> = (res: Response) => T | Promise<T>;

export enum Status {
  Unknown,
  Idle,
  Pending,
  Success,
  Error,
  Cancelled,
}

export type Res<T> =
  | { status: Status.Unknown }
  | { status: Status.Idle }
  | { status: Status.Pending }
  | { status: Status.Success; result: T }
  | { status: Status.Error; error: any }
  | { status: Status.Cancelled };
