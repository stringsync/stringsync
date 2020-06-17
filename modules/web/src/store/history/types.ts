import { CaseReducer, PayloadAction } from '@reduxjs/toolkit';

export type HistoryState = {
  returnToRoute: string;
};

export type HistoryReducers = {
  setReturnToRoute: CaseReducer<HistoryState, PayloadAction<string>>;
};
