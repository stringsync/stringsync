type Keys = 'OK' | 'BAD_REQUEST' | 'FORBIDDEN' | 'INTERNAL_SERVER_ERROR';

export type HttpStatuses = { [key in Keys]: number };

export type HttpStatus = HttpStatuses[keyof HttpStatuses];

export interface ErrorObject {
  detail: string;
}
