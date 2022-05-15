import { createAction, createReducer } from '@reduxjs/toolkit';
import React, { PropsWithChildren, useEffect, useReducer } from 'react';
import { useMedia } from '../../hooks/useMedia';
import { getViewportState } from './getViewportState';
import { Breakpoint, ViewportState } from './types';

const VIEWPORT_ACTIONS = {
  setViewportState: createAction<{ state: ViewportState }>('setBreakpoint'),
  updateDimensions: createAction<{ innerHeight: number; innerWidth: number }>('updateDimensions'),
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
  builder.addCase(VIEWPORT_ACTIONS.setViewportState, (state, action) => {
    return action.payload.state;
  });
  builder.addCase(VIEWPORT_ACTIONS.updateDimensions, (state, action) => {
    state.innerHeight = action.payload.innerHeight;
    state.innerWidth = action.payload.innerWidth;
  });
});

export const ViewportCtx = React.createContext<ViewportState>(getInitialState());

export const ViewportProvider: React.FC<PropsWithChildren<{}>> = (props) => {
  const [state, dispatch] = useReducer(viewportReducer, getInitialState());

  const breakpoint = useMedia(BREAKPOINT_QUERIES, BREAKPOINTS, 'xxl');

  useEffect(() => {
    dispatch(VIEWPORT_ACTIONS.setViewportState({ state: getViewportState(breakpoint) }));
  }, [breakpoint]);

  useEffect(() => {
    const onResize = () => {
      dispatch(VIEWPORT_ACTIONS.updateDimensions({ innerHeight: window.innerHeight, innerWidth: window.innerWidth }));
    };
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      window.addEventListener('orientationchange', onResize);
    };
  }, []);

  return <ViewportCtx.Provider value={state}>{props.children}</ViewportCtx.Provider>;
};
