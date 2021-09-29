import { createAction, createReducer } from '@reduxjs/toolkit';
import React, { useEffect, useReducer } from 'react';
import { useMedia } from '../../hooks/useMedia';
import { getViewportState } from './getViewportState';
import { Breakpoint, ViewportState } from './types';

const VIEWPORT_ACTIONS = {
  setBreakpoint: createAction<{ breakpoint: Breakpoint }>('setBreakpoint'),
};

const BREAKPOINT_QUERIES = [
  '(max-width: 575px)',
  '(max-width: 767px)',
  '(max-width: 991px)',
  '(max-width: 1199px)',
  '(max-width: 1599px)',
];

const BREAKPOINTS: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl'];

const getInitialState = (): ViewportState => getViewportState('xs');

const viewportReducer = createReducer(getInitialState(), (builder) => {
  builder.addCase(VIEWPORT_ACTIONS.setBreakpoint, (state, action) => {
    return getViewportState(action.payload.breakpoint);
  });
});

export const ViewportCtx = React.createContext<ViewportState>(getInitialState());

export const ViewportProvider: React.FC = (props) => {
  const [state, dispatch] = useReducer(viewportReducer, getInitialState());

  const breakpoint = useMedia(BREAKPOINT_QUERIES, BREAKPOINTS, 'xxl');

  useEffect(() => {
    dispatch(VIEWPORT_ACTIONS.setBreakpoint({ breakpoint }));
  }, [breakpoint]);

  return <ViewportCtx.Provider value={state}>{props.children}</ViewportCtx.Provider>;
};
