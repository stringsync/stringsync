import { CaseReducer, PayloadAction } from '@reduxjs/toolkit';

export type HistoryState = {
  prevRoute: string;
  returnToRoute: string;
};

export type HistoryReducers = {
  setPrevRoute: CaseReducer<HistoryState, PayloadAction<string>>;
  setReturnToRoute: CaseReducer<HistoryState, PayloadAction<string>>;
};
