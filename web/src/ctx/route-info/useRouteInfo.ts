import { useContext } from 'react';
import { RouteInfoCtx } from './RouteInfoCtx';

export const useRouteInfo = () => {
  const state = useContext(RouteInfoCtx);
  return state;
};
