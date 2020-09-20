import { HttpStatus } from '@stringsync/common';
import { matcherHint } from 'jest-matcher-utils';
import { Response } from '../types';

const message = (pass: boolean, expected: HttpStatus) => () =>
  pass
    ? matcherHint('.not.toHaveHttpStatus', 'received', expected.toString())
    : matcherHint('.toHaveHttpStatus', 'received', expected.toString());

export const toHaveHttpStatus: jest.CustomMatcher = function(res: Response<any, any>, expected: HttpStatus) {
  const actual = res.statusCode;
  const pass = this.equals(actual, expected);
  return { pass, message: message(pass, expected) };
};
