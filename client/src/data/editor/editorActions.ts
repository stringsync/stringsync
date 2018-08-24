import { createAction } from 'utilities/redux';
import { Vextab } from 'models';

export const SET_ENABLED = 'editor/SET_ENABLED';
export const SET_ELEMENT_INDEX = 'editor/SET_ELEMENT_INDEX';
export const APPEND_ERRORS = 'editor/APPEND_ERRORS';
export const REMOVE_ERRORS = 'editor/REMOVE_ERRORS';
export const SET_VEXTAB = 'editor/SET_VEXTAB';
export const NOTIFY_RENDER = 'editor/NOTIFY_RENDER';

export const EditorActions = {
  appendErrors: (errors: string[]) => createAction(APPEND_ERRORS, { errors }),
  notifyRender: () => createAction(NOTIFY_RENDER),
  removeErrors: () => createAction(REMOVE_ERRORS),
  setElementIndex: (elementIndex: number) => createAction(SET_ELEMENT_INDEX, { elementIndex }),
  setEnabled: (enabled: boolean) => createAction(SET_ENABLED, { enabled }),
  setVextab: (vextab: Vextab | null) => createAction(SET_VEXTAB, { vextab })
};

export type EditorActions = ActionsUnion<typeof EditorActions>;
