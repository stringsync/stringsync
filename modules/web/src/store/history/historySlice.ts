import { CaseReducer, PayloadAction, createSlice } from '@reduxjs/toolkit';

type State = {
  returnToRoute: string;
};

type Reducers = {
  setReturnToRoute: CaseReducer<State, PayloadAction<{ returnToRoute: string }>>;
};

export const historySlice = createSlice<State, Reducers, 'history'>({
  name: 'history',
  initialState: { returnToRoute: '' },
  reducers: {
    setReturnToRoute(state, action) {
      state.returnToRoute = action.payload.returnToRoute;
    },
  },
});
