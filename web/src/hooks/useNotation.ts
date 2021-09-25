import { useEffect, useReducer } from 'react';
import { NotationObject } from '../graphql';
import * as $$queries from '../graphql/$$queries';
import { GraphqlRequestStatus, useGraphqlRequest } from './useGraphqlRequest';
import { useMemoCmp } from './useMemoCmp';

export type NotationState = {
  notation: NotationObject | null;
  errors: string[];
  isLoading: boolean;
};

enum ActionType {
  Pending,
  Resolved,
  Rejected,
  NotFound,
}

type Action =
  | { type: ActionType.Pending }
  | { type: ActionType.Resolved; notation: NotationObject }
  | { type: ActionType.Rejected; errors: string[] }
  | { type: ActionType.NotFound };

const INITIAL_STATE: NotationState = { notation: null, errors: [], isLoading: true };

export const useNotation = (id: string) => {
  const [state, dispatch] = useReducer((state: NotationState, action: Action) => {
    switch (action.type) {
      case ActionType.Pending:
        return { notation: null, errors: [], isLoading: true };
      case ActionType.Resolved:
        return { notation: action.notation, errors: [], isLoading: false };
      case ActionType.Rejected:
        return { notation: null, errors: action.errors, isLoading: false };
      case ActionType.NotFound:
        return { notation: null, errors: ['notation not found'], isLoading: false };
      default:
        return state;
    }
  }, INITIAL_STATE);

  const input = useMemoCmp({ id });
  const { response, status } = useGraphqlRequest($$queries.notation, input);

  useEffect(() => {
    if (status === GraphqlRequestStatus.Pending) {
      dispatch({ type: ActionType.Pending });
    }
  }, [status]);

  useEffect(() => {
    if (!response) {
      return;
    }

    if (response.errors) {
      const errors = response.errors.map((error) => error.message);
      dispatch({ type: ActionType.Rejected, errors });
      return;
    }

    if (!response.data?.notation) {
      dispatch({ type: ActionType.NotFound });
      return;
    }

    dispatch({ type: ActionType.Resolved, notation: response.data.notation });
  }, [response, status]);

  return state;
};
