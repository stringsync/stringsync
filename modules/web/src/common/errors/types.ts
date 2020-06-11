type Keys =
  | 'OK'
  | 'BAD_REQUEST'
  | 'FORBIDDEN'
  | 'INTERNAL_SERVER_ERROR'
  | 'NOT_FOUND';

export type HttpStatuses = { [key in Keys]: number };

export type HttpStatus = HttpStatuses[keyof HttpStatuses];

export interface Extensions {
  status: number;
}
