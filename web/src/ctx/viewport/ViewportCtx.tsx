import { createAction, createReducer } from '@reduxjs/toolkit';
import React, { useEffect, useReducer } from 'react';
import { useMedia } from '../../hooks/useMedia';
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

const VIEWPORT_ACTIONS = {
  update: createAction<{ breakpoint: Breakpoint }>('update'),
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
  builder.addCase(VIEWPORT_ACTIONS.update, (state, action) => {
    return getViewportState(action.payload.breakpoint);
  });
});

export const ViewportCtx = React.createContext<ViewportState>(getInitialState());

export const ViewportProvider: React.FC = (props) => {
  const [state, dispatch] = useReducer(viewportReducer, getInitialState());

  const breakpoint = useMedia(BREAKPOINT_QUERIES, BREAKPOINTS, 'xxl');

  useEffect(() => {
    dispatch(VIEWPORT_ACTIONS.update({ breakpoint }));
  }, [breakpoint]);

  return <ViewportCtx.Provider value={state}>{props.children}</ViewportCtx.Provider>;
};
