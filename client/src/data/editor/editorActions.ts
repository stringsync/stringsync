import { createAction } from 'utilities/redux';

export const SET_ENABLED = 'editor/SET_ENABLED';
export const SET_ELEMENT_INDEX = 'editor/SET_ELEMENT_INDEX';

export const EditorActions = {
  setElementIndex: (elementIndex: number) => createAction(SET_ELEMENT_INDEX, { elementIndex }),
  setEnabled: (enabled: boolean) => createAction(SET_ENABLED, { enabled })
};

export type EditorActions = ActionsUnion<typeof EditorActions>;
