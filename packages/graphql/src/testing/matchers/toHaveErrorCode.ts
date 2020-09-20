import { ErrorCode } from '@stringsync/common';
import { GraphQLError } from 'graphql';
import { matcherHint } from 'jest-matcher-utils';
import { Response } from '../types';
import { get } from 'lodash';

const message = (pass: boolean, expected: ErrorCode) => () =>
  pass
    ? matcherHint('.not.toHaveErrorCode', 'received', expected.toString())
    : matcherHint('.toHaveErrorCode', 'received', expected.toString());

export const toHaveErrorCode: jest.CustomMatcher = function(res: Response<any, any>, expected: ErrorCode) {
  const errors = res.body.errors || new Array<GraphQLError>();
  const pass = errors.some((err) => get(err, 'extensions.code') === expected);
  return { pass, message: message(pass, expected) };
};
