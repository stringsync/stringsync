import { useContext } from 'react';
import { ViewportDispatch, ViewportDispatchCtx, ViewportState, ViewportStateCtx } from './ViewportCtx';

export const useViewportState = (): [ViewportState, ViewportDispatch] => {
  const state = useContext(ViewportStateCtx);
  const dispatch = useContext(ViewportDispatchCtx);
  return [state, dispatch];
};
