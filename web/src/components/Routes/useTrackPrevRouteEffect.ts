import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { AppDispatch, historySlice } from '../../store';

export const useTrackPrevRouteEffect = () => {
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();

  // This only fires when cleaning up so it is not run when it initially mounts.
  useEffect(
    () => () => {
      dispatch(historySlice.actions.setPrevRoute(location.pathname));
    },
    [dispatch, location]
  );
};
