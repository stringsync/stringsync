import { createAction } from 'utilities/redux';

export const SET_ENABLED = 'editor/SET_ENABLED';
export const SET_MEASURE_INDEX = 'editor/SET_MEASURE_INDEX';
export const SET_ELEMENT_INDEX = 'editor/SET_ELEMENT_INDEX';

export const EditorActions = {
  setElementIndex: (elementIndex: number | null) => createAction(SET_ELEMENT_INDEX, { elementIndex }),
  setEnabled: (enabled: boolean) => createAction(SET_ENABLED, { enabled }),
  setMeasureIndex: (measureIndex: number | null) => createAction(SET_MEASURE_INDEX, { measureIndex })
};

export type EditorActions = ActionsUnion<typeof EditorActions>;
