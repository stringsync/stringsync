import { LibraryState, LibraryReducers, NotationPreview } from './types';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { PageInfo, ConnectionArgs } from '@stringsync/common';
import { NotationClient } from '../../clients/notation';
import { toUserRole } from '../../clients';

export type NotationsReturned = { notations: NotationPreview[]; pageInfo: PageInfo };
export type NotationsThunkArg = ConnectionArgs;
export type NotationsThunkConfig = { rejectValue: { errors: string[] } };
export const getNotationPage = createAsyncThunk<NotationsReturned, NotationsThunkArg, NotationsThunkConfig>(
  'library/getNotationPage',
  async (args, thunk) => {
    const notationClient = NotationClient.create();
    const { data, errors } = await notationClient.notations(args);

    if (errors) {
      return thunk.rejectWithValue({ errors: errors.map((error) => error.message) });
    }

    const notationConnection = data.notations;
    const pageInfo = notationConnection.pageInfo;
    return {
      notations: notationConnection.edges.map((edge) => {
        const role = toUserRole(edge.node.transcriber.role);
        const transcriber = { ...edge.node.transcriber, role };
        return { ...edge.node, transcriber } as NotationPreview;
      }),
      pageInfo: {
        startCursor: pageInfo.startCursor || null,
        endCursor: pageInfo.endCursor || null,
        hasNextPage: pageInfo.hasNextPage,
        hasPreviousPage: pageInfo.hasPreviousPage,
      },
    };
  }
);

export const librarySlice = createSlice<LibraryState, LibraryReducers, 'library'>({
  name: 'library',
  initialState: {
    isPending: false,
    notations: [],
    errors: [],
    pageInfo: { startCursor: null, endCursor: null, hasNextPage: true, hasPreviousPage: false },
  },
  reducers: {
    addNotations(state, action) {
      state.notations = [...state.notations, ...action.payload.notations];
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

export const { addNotations } = librarySlice.actions;
