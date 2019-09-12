import React from 'react';
import { BreakpointName, SET_BREAKPOINT_NAME } from '../../store/screen/types';
import useMedia from '../../hooks/use-media/useMedia';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';

const BREAKPOINT_QUERIES = [
  '(max-width: 575px)',
  '(max-width: 767px)',
  '(max-width: 991px)',
  '(max-width: 1199px)',
  '(max-width: 1599px)',
];

const BREAKPOINT_NAMES: BreakpointName[] = ['xs', 'sm', 'md', 'lg', 'xl'];

interface Props {}

const ScreenSyncer: React.FC<Props> = (props) => {
  const dispatch = useDispatch();
  const breakpointName = useSelector<RootState, BreakpointName>(
    (state) => state.screen.breakpointName
  );
  const nextBreakpointName = useMedia(
    BREAKPOINT_QUERIES,
    BREAKPOINT_NAMES,
    'xxl'
  );

  if (nextBreakpointName !== breakpointName) {
    dispatch({
      type: SET_BREAKPOINT_NAME,
      payload: { breakpointName: nextBreakpointName },
    });
  }
  return null;
};

export default ScreenSyncer;
