import { createAction, createReducer } from '@reduxjs/toolkit';
import { useEffect, useReducer } from 'react';
import { $gql, DataOf, QueryNotationArgs, t } from '../graphql';
import { useGraphqlRequest } from './useGraphqlRequest';

type Notation = DataOf<typeof notationGql>;

type State = {
  notation: Notation | null;
  errors: string[];
  isLoading: boolean;
};

const notationGql = $gql
  .query('notation')
  .setQuery({
    id: t.string,
    createdAt: t.string,
    updatedAt: t.string,
    songName: t.string,
    artistName: t.string,
    deadTimeMs: t.number,
    durationMs: t.number,
    private: t.boolean,
    transcriberId: t.string,
    thumbnailUrl: t.optional.string,
    videoUrl: t.optional.string,
    musicXmlUrl: t.optional.string,
    transcriber: { username: t.string },
  })
  .setVariables<QueryNotationArgs>({ id: t.string })
  .build();

const getInitialState = (): State => ({ notation: null, errors: [], isLoading: true });

const pending = createAction('pending');
const resolve = createAction<{ notation: Notation }>('resolve');
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

export const useNotation = (id: string): [Notation | null, string[], boolean] => {
  const [state, dispatch] = useReducer(notationReducer, getInitialState());

  const [response, isLoading] = useGraphqlRequest(notationGql, { id });

  useEffect(() => {
    if (isLoading) {
      dispatch(pending());
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

    const notation = response.data.notation;
    if (!notation) {
      dispatch(notFound());
      return;
    }

    dispatch(resolve({ notation }));
  }, [response]);

  return [state.notation, state.errors, state.isLoading];
};
