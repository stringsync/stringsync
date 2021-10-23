import { matcherHint, printExpected, printReceived } from 'jest-matcher-utils';
import * as testing from '../testing';

const message = (pass: boolean, note: string, expectedTimes: number, receivedTimes: number) => () => {
  const msg = pass
    ? matcherHint('.not.toRenderNoteTimes', 'received', `${note}, ${expectedTimes}`)
    : matcherHint('.toRenderNoteTimes', 'received', `${note}, ${expectedTimes}`);

  return `${msg}\n\nExpected:\n\t${printExpected(
    `the note ${note} to be rendered ${expectedTimes} time(s)`
  )}\nReceived:\n\t${printReceived(`the note ${note} rendered ${receivedTimes} time(s)`)}`;
};

export const toRenderNoteTimes: jest.CustomMatcher = function(
  container: HTMLElement,
  note: string,
  expectedTimes: number
) {
  const receivedTimes = testing.getPositionElsByNote(container, note).length;
  const pass = receivedTimes === expectedTimes;
  return { pass, message: message(pass, note, expectedTimes, receivedTimes) };
};
