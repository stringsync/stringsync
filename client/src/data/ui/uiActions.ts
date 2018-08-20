import { createAction } from 'utilities/redux';

export const SET_NOTATION_MENU_VISIBILITY = 'SET_NOTATION_MENU_VISIBILITY';
export const SET_LOOP_VISIBILITY = 'SET_LOOP_VISIBILITY';
export const SET_FRETBOARD_VISIBILITY = 'SET_FRETBOARD_VISIBILITY';
export const SET_PIANO_VISIBILITY = 'SET_PIANO_VISIBILITY';

export const UiActions = {
  setFretboardVisibility: (fretboardVisibility: boolean) => createAction(SET_FRETBOARD_VISIBILITY, { fretboardVisibility }),
  setLoopVisibility: (loopVisibility: boolean) => createAction(SET_LOOP_VISIBILITY, { loopVisibility }),
  setNotationMenuVisibility: (notationMenuVisibility: boolean) => createAction(SET_NOTATION_MENU_VISIBILITY, { notationMenuVisibility }),
  setPianoVisibility: (pianoVisibility: boolean) => createAction(SET_PIANO_VISIBILITY, { pianoVisibility })
};

export type UiActions = ActionsUnion<typeof UiActions>;
