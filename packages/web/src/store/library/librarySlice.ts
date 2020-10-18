import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { PageInfo, NotationConnectionArgs } from '@stringsync/common';
import { toUserRole } from '../../clients';
import { NotationClient } from '../../clients/notation';
import { LibraryReducers, LibraryState, NotationPreview } from './types';

export type GetNotationPageReturned = { notations: NotationPreview[]; pageInfo: PageInfo };
export type GetNotationPageThunkArg = NotationConnectionArgs;
export type GetNotationPageThunkConfig = { rejectValue: { errors: string[] } };
export const getNotationPage = createAsyncThunk<
  GetNotationPageReturned,
  GetNotationPageThunkArg,
  GetNotationPageThunkConfig
>('library/getNotationPage', async (args, thunk) => {
  const notationClient = NotationClient.create();
  const { data, errors } = await notationClient.notations(args);

  if (errors) {
    return thunk.rejectWithValue({ errors: errors.map((error) => error.message) });
  }

  const notationConnection = data.notations;
  const pageInfo = notationConnection.pageInfo;
  return {
    notations: notationConnection.edges
      .map((edge) => {
        const role = toUserRole(edge.node.transcriber.role);
        const transcriber = { ...edge.node.transcriber, role };
        return { ...edge.node, transcriber } as NotationPreview;
      })
      .reverse(), // the server sorts by ascending cursor for us
    pageInfo: {
      startCursor: pageInfo.startCursor || null,
      endCursor: pageInfo.endCursor || null,
      hasNextPage: pageInfo.hasNextPage,
      hasPreviousPage: pageInfo.hasPreviousPage,
    },
  };
});

export const librarySlice = createSlice<LibraryState, LibraryReducers, 'library'>({
  name: 'library',
  initialState: {
    isPending: false,
    query: '',
    tagIds: [],
    notations: [],
    errors: [],
    pageInfo: { startCursor: null, endCursor: null, hasNextPage: true, hasPreviousPage: false },
  },
  reducers: {
    setQuery(state, action) {
      state.query = action.payload.query;
    },
    setTagIds(state, action) {
      state.tagIds = action.payload.tagIds;
    },
    clearErrors(state) {
      state.errors = [];
    },
    clearPages(state) {
      state.notations = [];
      state.errors = [];
      state.pageInfo = { startCursor: null, endCursor: null, hasNextPage: true, hasPreviousPage: false };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getNotationPage.pending, (state) => {
      state.isPending = true;
      state.errors = [];
    });
    builder.addCase(getNotationPage.fulfilled, (state, action) => {
      state.isPending = false;
      state.notations = [...state.notations, ...action.payload.notations];
      state.pageInfo = action.payload.pageInfo;
    });
    builder.addCase(getNotationPage.rejected, (state, action) => {
      state.isPending = false;
      if (action.payload) {
        state.errors = action.payload.errors;
      } else if (action.error.message) {
        state.errors = [action.error.message];
      } else {
        state.errors = ['could not fetch notations'];
      }
    });
  },
});

export const { setQuery, setTagIds, clearErrors, clearPages } = librarySlice.actions;
