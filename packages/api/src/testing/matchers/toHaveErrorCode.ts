import { ErrorCode } from '@stringsync/common';
import { GraphQLError } from 'graphql';
import { matcherHint, printExpected, printReceived } from 'jest-matcher-utils';
import { get } from 'lodash';
import { Response } from '../types';

const toString = (errorCode: ErrorCode): string => {
  switch (errorCode) {
    case ErrorCode.UNKNOWN:
      return 'ErrorCode.UNKNOWN';
    case ErrorCode.NOT_FOUND:
      return 'ErrorCode.NOT_FOUND';
    case ErrorCode.INTERNAL:
      return 'ErrorCode.INTERNAL';
    case ErrorCode.FORBIDDEN:
      return 'ErrorCode.FORBIDDEN';
    case ErrorCode.CONFLICT:
      return 'ErrorCode.CONFLICT';
    case ErrorCode.BAD_REQUEST:
      return 'ErrorCode.BAD_REQUEST';
    default:
      throw new Error(`unhandled ErrorCode: ${errorCode}`);
  }
};

const message = (pass: boolean, expected: ErrorCode, errorCodes: ErrorCode[]) => () => {
  const msg = pass
    ? matcherHint('.not.toHaveErrorCode', 'received', toString(expected))
    : matcherHint('.toHaveErrorCode', 'received', toString(expected));

  return `${msg}\n\nExpected:\n\t${printExpected(toString(expected))}\nReceived:\n\t${printReceived(
    errorCodes.map(toString)
  )}`;
};

export const toHaveErrorCode: jest.CustomMatcher = function(res: Response<any, any>, expected: ErrorCode) {
  const errors = res.body.errors || new Array<GraphQLError>();
  const errorCodes = errors.map((err) => get(err, 'extensions.code'));
  const pass = errorCodes.some((errorCode) => errorCode === expected);
  return { pass, message: message(pass, expected, errorCodes) };
};
