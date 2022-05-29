import { matcherHint, printExpected, printReceived } from 'jest-matcher-utils';
import { get } from 'lodash';
import * as fretboard from '../lib/fretboard';

type Position = {
  fret: number;
  string: number;
};

const message = (
  pass: boolean,
  position: Position,
  style: string,
  expected: string,
  received: fretboard.PositionStyle | null
) => () => {
  const msg = pass
    ? matcherHint('.not.toHavePositionStyle', 'received', 'position, style, value')
    : matcherHint('.toHavePositionStyle', 'received', 'position, style, value');

  return `${msg}\n\nExpected partial style at (fret, string) (${position.fret}, ${position.string}):\n\t${printExpected(
    {
      [style]: expected,
    }
  )}\nReceived:\n\t${printReceived(received)}`;
};

export const toHavePositionStyle: jest.CustomMatcher = function(
  container: HTMLElement,
  position: Position,
  style: keyof fretboard.PositionStyle,
  expectedValue: string
) {
  const received = fretboard.getStyleAtPosition(container, position);
  const pass = get(received, style) === expectedValue;
  return { pass, message: message(pass, position, style, expectedValue, received) };
};
