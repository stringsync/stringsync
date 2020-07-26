import { LibraryState, LibraryReducers } from './types';
import { createSlice } from '@reduxjs/toolkit';

export const librarySlice = createSlice<LibraryState, LibraryReducers, 'library'>({
  name: 'library',
  initialState: { notations: [] },
  reducers: {
    addNotations(state, action) {
      state.notations = [...state.notations, ...action.payload.notations];
    },
  },
});

export const { addNotations } = librarySlice.actions;
