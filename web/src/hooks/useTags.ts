import { createAction, createReducer } from '@reduxjs/toolkit';
import { useEffect, useReducer } from 'react';
import { TagObject } from '../graphql';
import * as $$queries from '../graphql/$$queries';
import { GraphqlRequestStatus, useGraphqlRequest } from './useGraphqlRequest';

export type TagsState = {
  tags: TagObject[];
  errors: string[];
  isLoading: boolean;
};

const getInitialState = (): TagsState => ({
  tags: [],
  errors: [],
  isLoading: true,
});

const pending = createAction('pending');
const resolve = createAction<{ tags: TagObject[] }>('resolve');
const reject = createAction<{ errors: string[] }>('reject');

const tagsReducer = createReducer(getInitialState(), (builder) => {
  builder.addCase(pending, (state, action) => {
    state.isLoading = true;
    state.errors = [];
    state.tags = [];
  });
  builder.addCase(resolve, (state, action) => {
    state.isLoading = false;
    state.tags = action.payload.tags;
  });
  builder.addCase(reject, (state, action) => {
    state.isLoading = false;
    state.errors = action.payload.errors;
  });
});

export const useTags = (): [TagObject[], string[], boolean] => {
  const [state, dispatch] = useReducer(tagsReducer, getInitialState());

  const { response, status } = useGraphqlRequest($$queries.tags);

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

    const tags = response.data.tags;
    dispatch(resolve({ tags }));
  }, [response]);

  return [state.tags, state.errors, state.isLoading];
};
