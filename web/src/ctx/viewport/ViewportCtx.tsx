import { createAction, createReducer } from '@reduxjs/toolkit';
import { noop } from 'lodash';
import React, { useReducer } from 'react';
import { Dispatch } from '../types';
import { getViewportState } from './getViewportState';
import { Breakpoint } from './types';

export type ViewportState = {
  xs: boolean;
  sm: boolean;
  md: boolean;
  lg: boolean;
  xl: boolean;
  xxl: boolean;
  breakpoint: Breakpoint;
};

export type ViewportDispatch = Dispatch<typeof VIEWPORT_ACTIONS>;

const getInitialState = (): ViewportState => getViewportState('xs');

export const VIEWPORT_ACTIONS = {
  update: createAction<{ breakpoint: Breakpoint }>('update'),
};

const viewportReducer = createReducer(getInitialState(), (builder) => {
  builder.addCase(VIEWPORT_ACTIONS.update, (state, action) => {
    return getViewportState(action.payload.breakpoint);
  });
});

export const ViewportStateCtx = React.createContext<ViewportState>(getInitialState());
export const ViewportDispatchCtx = React.createContext(noop);

export const ViewportProvider: React.FC = (props) => {
  const [state, dispatch] = useReducer(viewportReducer, getInitialState());

  return (
    <ViewportStateCtx.Provider value={state}>
      <ViewportDispatchCtx.Provider value={dispatch}>{props.children}</ViewportDispatchCtx.Provider>
    </ViewportStateCtx.Provider>
  );
};
