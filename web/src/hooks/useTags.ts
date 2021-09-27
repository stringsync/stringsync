import { createAction, createReducer } from '@reduxjs/toolkit';
import { useEffect, useReducer } from 'react';
import { DataOf, Gql } from '../graphql/$gql';
import { useGraphqlRequest } from './useGraphqlRequest';

type Tags = DataOf<typeof tagsGql>;

type TagsState = {
  tags: Tags;
  errors: string[];
  isLoading: boolean;
};

export const tagsGql = Gql.query('tags')
  .setQuery([{ id: Gql.string, name: Gql.string }])
  .build();

const getInitialState = (): TagsState => ({
  tags: [],
  errors: [],
  isLoading: true,
});

const loading = createAction('loading');
const resolve = createAction<{ tags: Tags }>('resolve');
const reject = createAction<{ errors: string[] }>('reject');

const tagsReducer = createReducer(getInitialState(), (builder) => {
  builder.addCase(loading, (state) => {
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

export const useTags = (): [Tags, string[], boolean] => {
  const [state, dispatch] = useReducer(tagsReducer, getInitialState());

  const [response, isLoading] = useGraphqlRequest(tagsGql, undefined);

  useEffect(() => {
    if (isLoading) {
      dispatch(loading());
    }
  }, [isLoading]);

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
