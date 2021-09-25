import { matcherHint, printExpected, printReceived } from 'jest-matcher-utils';
import * as testing from '../testing';

const message = (pass: boolean, expected: number, received: number) => () => {
  const msg = pass
    ? matcherHint('.not.toRenderNumPositions', 'received', expected.toString())
    : matcherHint('.toRenderNumPositions', 'received', expected.toString());

  return `${msg}\n\nExpected:\n\t${printExpected(expected.toString())}\nReceived:\n\t${printReceived(
    received.toString()
  )}`;
};

export const toRenderNumPositions: jest.CustomMatcher = function(container: HTMLElement, times: number) {
  const received = testing.getAllPositionEls(container).length;
  const pass = received === times;
  return { pass, message: message(pass, times, received) };
};
