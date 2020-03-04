import React from 'react';
import { BreakpointName, setBreakpointName } from '../../store';
import { useMedia } from '../../hooks';
import { useDispatch } from 'react-redux';
import { useStoreState } from '../../hooks/useStoreState';

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
  const breakpointName = useStoreState(
    (state) => state.viewport.breakpointName
  );
  const nextBreakpointName = useMedia(
    BREAKPOINT_QUERIES,
    BREAKPOINT_NAMES,
    'xxl'
  );

  if (nextBreakpointName !== breakpointName) {
    dispatch(
      setBreakpointName({
        breakpointName: nextBreakpointName,
      })
    );
  }
  return null;
};

export default StoreViewportSync;
