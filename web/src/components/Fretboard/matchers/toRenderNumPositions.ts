import { matcherHint, printExpected, printReceived } from 'jest-matcher-utils';
import * as fretboard from '../testing';

const message = (pass: boolean, expected: number, received: number) => () => {
  const msg = pass
    ? matcherHint('.not.toRenderNumPositions', 'received', expected.toString())
    : matcherHint('.toRenderNumPositions', 'received', expected.toString());

  return `${msg}\n\nExpected:\n\t${printExpected(expected.toString())}\nReceived:\n\t${printReceived(
    received.toString()
  )}`;
};

export const toRenderNumPositions: jest.CustomMatcher = function(container: HTMLElement, expected: number) {
  const received = fretboard.getAllPositionEls(container).length;
  const pass = received === expected;
  return { pass, message: message(pass, expected, received) };
};
