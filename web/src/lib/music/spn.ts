// This module contains the state machine for scientific pitch notation.
// https://en.wikipedia.org/wiki/Scientific_pitch_notation

import { EventFrom, interpret } from 'xstate';
import { assign, escalate } from 'xstate/lib/actions';
import { createModel } from 'xstate/lib/model';

export type SpnContext = {
  nameChars: string[];
  accidentalChars: string[];
  octaveChars: string[];
};

type SpnEvent = EventFrom<typeof spnModel>;

const NULL_PITCH_CHAR = 'X';

const NAME_CHARS = ['X', 'A', 'B', 'C', 'D', 'E', 'F', 'G'];

const NUMBER_CHARS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

const ACCIDENTAL_CHARS = ['b', '#'];

const DEFAULT_SPN_CONTEXT: SpnContext = {
  nameChars: [],
  accidentalChars: [],
  octaveChars: [],
};

const spnModel = createModel(DEFAULT_SPN_CONTEXT, {
  events: { feed: (char: string) => ({ char }), end: () => ({}) },
});

const spnMachine = spnModel.createMachine(
  {
    id: 'spn',
    initial: 'init',
    preserveActionOrder: true,
    strict: true,
    states: {
      init: {
        on: {
          feed: [
            { cond: 'isNullPitchChar', target: 'done', actions: ['pushNameChar'] },
            { cond: 'isValidNameChar', target: 'name', actions: ['pushNameChar'] },
            { target: 'done', actions: ['throwError'] },
          ],
          end: { target: 'done', actions: ['throwError'] },
        },
      },
      name: {
        on: {
          feed: [
            { cond: 'isValidAccidentalChar', target: 'accidental', actions: ['pushAccidentalChar'] },
            { cond: 'isValidOctaveChar', target: 'octave', actions: ['pushOctaveChar'] },
            { target: 'done', actions: ['throwError'] },
          ],
          end: { target: 'done', actions: ['throwError'] },
        },
      },
      accidental: {
        on: {
          feed: [
            { cond: 'isValidDoubleAccidentalChar', target: 'doubleAccidental', actions: ['pushAccidentalChar'] },
            { cond: 'isValidOctaveChar', target: 'octave', actions: ['pushOctaveChar'] },
            { target: 'done', actions: ['throwError'] },
          ],
          end: { target: 'done', actions: ['throwError'] },
        },
      },
      doubleAccidental: {
        on: {
          feed: [
            { cond: 'isValidOctaveChar', target: 'octave', actions: ['pushOctaveChar'] },
            { target: 'done', actions: ['throwError'] },
          ],
          end: { target: 'done', actions: ['throwError'] },
        },
      },
      octave: {
        on: {
          feed: [
            { cond: 'isValidOctaveChar', target: 'octave', actions: ['pushOctaveChar'] },
            { target: 'done', actions: ['throwError'] },
          ],
          end: { target: 'done' },
        },
      },
      done: { on: { feed: { actions: ['throwError'] }, end: { actions: ['throwError'] } } },
    },
  },
  {
    actions: {
      pushNameChar: assign<SpnContext, SpnEvent>({
        nameChars: (context, event) => {
          if (event.type === 'feed') {
            return [...context.nameChars, event.char];
          }
          return context.nameChars;
        },
      }),
      pushAccidentalChar: assign<SpnContext, SpnEvent>({
        accidentalChars: (context, event) => {
          if (event.type === 'feed') {
            return [...context.accidentalChars, event.char];
          }
          return context.accidentalChars;
        },
      }),
      pushOctaveChar: assign<SpnContext, SpnEvent>({
        octaveChars: (context, event) => {
          if (event.type === 'feed') {
            return [...context.octaveChars, event.char];
          }
          return context.octaveChars;
        },
      }),
      throwError: escalate({ message: 'could not parse' }),
    },
    guards: {
      isNullPitchChar: (context, event) => {
        if (event.type !== 'feed') {
          return false;
        }
        return NULL_PITCH_CHAR === event.char;
      },
      isValidNameChar: (context, event) => {
        if (event.type !== 'feed') {
          return false;
        }
        return context.nameChars.length === 0 && NAME_CHARS.includes(event.char);
      },
      isValidAccidentalChar: (context, event) => {
        if (event.type !== 'feed') {
          return false;
        }
        return context.accidentalChars.length === 0 && ACCIDENTAL_CHARS.includes(event.char);
      },
      isValidDoubleAccidentalChar: (context, event) => {
        if (event.type !== 'feed') {
          return false;
        }
        return context.accidentalChars.length === 1 && event.char === context.accidentalChars[0];
      },
      isValidOctaveChar: (context, event) => {
        if (event.type !== 'feed') {
          return false;
        }
        if (context.octaveChars.length > 1 && context.octaveChars[0] === '0') {
          return false;
        }
        return NUMBER_CHARS.includes(event.char);
      },
    },
  }
);

const createService = () => {
  const service = interpret(spnMachine);
  service.start();
  return service;
};

export const parse = (str: string): SpnContext => {
  const spnService = createService();
  for (const char of str) {
    spnService.send(spnModel.events.feed(char));
  }
  spnService.send(spnModel.events.end());
  return spnService.state.context;
};
