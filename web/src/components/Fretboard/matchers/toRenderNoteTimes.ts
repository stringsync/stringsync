import { matcherHint, printExpected, printReceived } from 'jest-matcher-utils';
import * as testing from '../testing';

const message = (pass: boolean, expectedNote: string, expectedTimes: number, receivedTimes: number) => () => {
  const msg = pass
    ? matcherHint('.not.toRenderNoteTimes', 'received', 'note, times')
    : matcherHint('.toRenderNoteTimes', 'received', 'note, times');

  return `${msg}\n\nExpected:\n\t${printExpected(
    `the note ${expectedNote} to be rendered ${expectedTimes} time(s)`
  )}\nReceived:\n\t${printReceived(`the note ${expectedNote} rendered ${receivedTimes} time(s)`)}`;
};

export const toRenderNoteTimes: jest.CustomMatcher = function(
  container: HTMLElement,
  expectedNote: string,
  expectedTimes: number
) {
  const receivedTimes = testing.getPositionElsByNote(container, expectedNote).length;
  const pass = receivedTimes === expectedTimes;
  return { pass, message: message(pass, expectedNote, expectedTimes, receivedTimes) };
};
