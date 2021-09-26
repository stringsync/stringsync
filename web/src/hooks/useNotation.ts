import { createAction, createReducer } from '@reduxjs/toolkit';
import { useEffect, useReducer } from 'react';
import { NotationObject } from '../graphql';
import * as $$queries from '../graphql/$$queries';
import { GraphqlRequestStatus, useGraphqlRequest } from './useGraphqlRequest';
import { useMemoCmp } from './useMemoCmp';

type State = {
  notation: NotationObject | null;
  errors: string[];
  isLoading: boolean;
};

const getInitialState = (): State => ({ notation: null, errors: [], isLoading: true });

const pending = createAction('pending');
const resolve = createAction<{ notation: NotationObject }>('resolve');
const reject = createAction<{ errors: string[] }>('reject');
const notFound = createAction('notFound');

const notationReducer = createReducer(getInitialState(), (builder) => {
  builder.addCase(pending, (state) => {
    state.notation = null;
    state.errors = [];
    state.isLoading = true;
  });
  builder.addCase(resolve, (state, action) => {
    state.notation = action.payload.notation;
    state.isLoading = false;
  });
  builder.addCase(reject, (state, action) => {
    state.errors = action.payload.errors;
    state.isLoading = false;
  });
  builder.addCase(notFound, (state) => {
    state.errors = ['notation not found'];
    state.isLoading = false;
  });
});

export const useNotation = (id: string): [NotationObject | null, string[], boolean] => {
  const [state, dispatch] = useReducer(notationReducer, getInitialState());

  const input = useMemoCmp({ id });
  const { response, status } = useGraphqlRequest($$queries.notation, input);

  useEffect(() => {
    if (status === GraphqlRequestStatus.Pending) {
      dispatch(pending());
    }
  }, [status]);

  useEffect(() => {
    if (!response) {
      return;
    }

    if (response.errors) {
      const errors = response.errors.map((error) => error.message);
      dispatch(reject({ errors }));
      return;
    }

    const notation = response.data.notation;
    if (!notation) {
      dispatch(notFound());
      return;
    }

    dispatch(resolve({ notation }));
  }, [response, status]);

  return [state.notation, state.errors, state.isLoading];
};
