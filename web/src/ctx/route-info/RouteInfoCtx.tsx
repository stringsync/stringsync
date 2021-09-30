import { createAction, createReducer } from '@reduxjs/toolkit';
import React, { useEffect, useReducer } from 'react';
import { useLocation } from 'react-router-dom';
import { RouteInfoState } from './types';

const ROUTE_INFO_ACTIONS = {
  setPrevRoute: createAction<{ prevRoute: string }>('setPrevRoute'),
  setReturnToRoute: createAction<{ returnToRoute: string }>('setReturnToRoute'),
};

const RETURN_TO_PATHNAMES = ['/library', '/n', '/upload'];

const getInitialState = (): RouteInfoState => ({ prevRoute: '', returnToRoute: '/library' });

const routeInfoReducer = createReducer(getInitialState(), (builder) => {
  builder.addCase(ROUTE_INFO_ACTIONS.setPrevRoute, (state, action) => {
    state.prevRoute = action.payload.prevRoute;
  });
  builder.addCase(ROUTE_INFO_ACTIONS.setReturnToRoute, (state, action) => {
    state.returnToRoute = action.payload.returnToRoute;
  });
});

export const RouteInfoCtx = React.createContext<RouteInfoState>(getInitialState());

export const RouteInfoProvider: React.FC = (props) => {
  const [state, dispatch] = useReducer(routeInfoReducer, getInitialState());
  const location = useLocation();

  useEffect(
    // This only fires when cleaning up so it is not run when it initially mounts.
    () => () => {
      dispatch(ROUTE_INFO_ACTIONS.setPrevRoute({ prevRoute: location.pathname }));
    },
    [location]
  );

  useEffect(() => {
    if (RETURN_TO_PATHNAMES.some((pathname) => location.pathname.startsWith(pathname))) {
      dispatch(ROUTE_INFO_ACTIONS.setReturnToRoute({ returnToRoute: location.pathname }));
    }
  }, [location]);

  return <RouteInfoCtx.Provider value={state}>{props.children}</RouteInfoCtx.Provider>;
};
