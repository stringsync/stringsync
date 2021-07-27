import { createMachine } from 'xstate';

export enum LibraryState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  INPUTTING = 'INPUTTING',
  ERRORED = 'ERRORED',
}

export enum LibraryEventType {
  START_INPUTTING = 'START_INPUTTING',
  STOP_INPUTTING = 'STOP_INPUTTING',
  START_LOADING = 'START_LOADING',
  STOP_LOADING = 'STOP_LOADING',
  ERROR = 'ERROR',
}

export type LibraryContext = {};

export type LibraryEvent =
  | { type: LibraryEventType.START_LOADING }
  | { type: LibraryEventType.STOP_LOADING }
  | { type: LibraryEventType.START_INPUTTING }
  | { type: LibraryEventType.STOP_INPUTTING }
  | { type: LibraryEventType.ERROR };

export const libraryMachine = createMachine<LibraryContext, LibraryEvent>({
  id: 'library',
  initial: LibraryState.IDLE,
  states: {
    [LibraryState.IDLE]: {
      on: {
        [LibraryEventType.START_LOADING]: {
          target: LibraryState.LOADING,
        },
        [LibraryEventType.START_INPUTTING]: {
          target: LibraryState.INPUTTING,
        },
      },
    },
    [LibraryState.LOADING]: {
      on: {
        [LibraryEventType.STOP_LOADING]: {
          target: LibraryState.IDLE,
        },
        [LibraryEventType.ERROR]: {
          target: LibraryState.ERRORED,
        },
      },
    },
    [LibraryState.INPUTTING]: {
      on: {
        [LibraryEventType.STOP_INPUTTING]: {
          target: LibraryState.LOADING,
        },
      },
    },
    [LibraryState.ERRORED]: {
      on: {
        [LibraryEventType.START_LOADING]: {
          target: LibraryState.LOADING,
        },
      },
    },
  },
});
