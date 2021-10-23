import { matcherHint, printExpected, printReceived } from 'jest-matcher-utils';
import { get } from 'lodash';
import { PositionStyle } from '..';
import * as testing from '../testing';

type Position = {
  fret: number;
  string: number;
};

const message = (
  pass: boolean,
  position: Position,
  style: string,
  expected: string,
  received: PositionStyle | null
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
  style: keyof PositionStyle,
  expectedValue: string
) {
  const received = testing.getStyleAtPosition(container, position);
  const pass = get(received, style) === expectedValue;
  return { pass, message: message(pass, position, style, expectedValue, received) };
};
