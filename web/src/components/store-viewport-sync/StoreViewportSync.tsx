import React from 'react';
import {
  RootState,
  BreakpointName,
  getSetBreakpointNameAction,
} from '../../store';
import { useMedia } from '../../hooks';
import { useDispatch, useSelector } from 'react-redux';

const BREAKPOINT_QUERIES = [
  '(max-width: 575px)',
  '(max-width: 767px)',
  '(max-width: 991px)',
  '(max-width: 1199px)',
  '(max-width: 1599px)',
];

const BREAKPOINT_NAMES: BreakpointName[] = ['xs', 'sm', 'md', 'lg', 'xl'];

interface Props {}

export const StoreViewportSync: React.FC<Props> = (props) => {
  const dispatch = useDispatch();
  const breakpointName = useSelector<RootState, BreakpointName>(
    (state) => state.viewport.breakpointName
  );
  const nextBreakpointName = useMedia(
    BREAKPOINT_QUERIES,
    BREAKPOINT_NAMES,
    'xxl'
  );

  if (nextBreakpointName !== breakpointName) {
    const setBreakpointNameAction = getSetBreakpointNameAction({
      breakpointName: nextBreakpointName,
    });
    dispatch(setBreakpointNameAction);
  }
  return null;
};

export default StoreViewportSync;
