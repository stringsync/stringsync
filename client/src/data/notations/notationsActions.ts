import { createActions } from 'redux-actions';

export interface NotationsPayload {
  readonly fetchedAt: number;
  readonly notations: Notation[];
}

export interface NotationPayload {
  readonly notation: Notation;
}

export const notationsActions = createActions<NotationsPayload | NotationPayload>({
  SET_NOTATIONS_INDEX: (notations: Notation[], fetchedAt: number): NotationsPayload => (
    Object.freeze({ notations, fetchedAt })
  ),
  SET_NOTATIONS_SHOW: (notation: Notation): NotationPayload => Object.freeze({ notation }),
  SET_NOTATIONS_EDIT: (notation: Notation): NotationPayload => Object.freeze({ notation }),
  UPDATE_NOTATIONS_EDIT: (notation: Notation): NotationPayload => Object.freeze({ notation })
});
