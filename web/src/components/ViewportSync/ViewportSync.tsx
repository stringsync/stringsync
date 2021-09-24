import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useMedia } from '../../hooks/useMedia';
import { AppDispatch, Breakpoint, RootState, setBreakpoint } from '../../store';

const BREAKPOINT_QUERIES = [
  '(max-width: 575px)',
  '(max-width: 767px)',
  '(max-width: 991px)',
  '(max-width: 1199px)',
  '(max-width: 1599px)',
];

const BREAKPOINTS: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl'];

export const ViewportSync: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const breakpoint = useSelector<RootState, Breakpoint>((state) => state.viewport.breakpoint);
  const nextBreakpoint = useMedia(BREAKPOINT_QUERIES, BREAKPOINTS, 'xxl');

  if (breakpoint !== nextBreakpoint) {
    dispatch(setBreakpoint({ breakpoint: nextBreakpoint }));
  }

  return null;
};
