import { matcherHint, printExpected, printReceived } from 'jest-matcher-utils';
import * as fretboard from '../testing';

type Position = {
  fret: number;
  string: number;
};

const message = (pass: boolean, expected: Position, received: Element | null) => () => {
  const msg = pass
    ? matcherHint('.not.toRenderNumPositions', 'received', 'position')
    : matcherHint('.toRenderNumPositions', 'received', 'position');

  return `${msg}\n\nExpected to render position at:\n\t${printExpected(expected)}\nReceived:\n\t${printReceived(
    received
  )}`;
};

export const toRenderPosition: jest.CustomMatcher = function(container: HTMLElement, expected: Position) {
  const received = fretboard.getPositionEl(container, expected);
  const pass = !!received;
  return { pass, message: message(pass, expected, received) };
};
