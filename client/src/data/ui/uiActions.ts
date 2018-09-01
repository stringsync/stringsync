import { createAction } from 'utilities/redux';

export const RESET = 'uiActions/RESET';
export const SET_NOTATION_MENU_VISIBILITY = 'SET_NOTATION_MENU_VISIBILITY';
export const SET_LOOP_VISIBILITY = 'SET_LOOP_VISIBILITY';
export const SET_FRETBOARD_VISIBILITY = 'SET_FRETBOARD_VISIBILITY';
export const SET_PIANO_VISIBILITY = 'SET_PIANO_VISIBILITY';
export const FOCUS_SCROLL_ELEMENT = 'ui/FOCUS_SCROLL_ELEMENT';

export const UiActions = {
  focusScrollElement: (focusedScrollElement: string | null) => createAction(FOCUS_SCROLL_ELEMENT, { focusedScrollElement }),
  reset: () => createAction(RESET),
  setFretboardVisibility: (fretboardVisibility: boolean) => createAction(SET_FRETBOARD_VISIBILITY, { fretboardVisibility }),
  setLoopVisibility: (loopVisibility: boolean) => createAction(SET_LOOP_VISIBILITY, { loopVisibility }),
  setNotationMenuVisibility: (notationMenuVisibility: boolean) => createAction(SET_NOTATION_MENU_VISIBILITY, { notationMenuVisibility }),
  setPianoVisibility: (pianoVisibility: boolean) => createAction(SET_PIANO_VISIBILITY, { pianoVisibility })
};

export type UiActions = ActionsUnion<typeof UiActions>;
