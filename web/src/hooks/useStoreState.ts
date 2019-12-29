import { useSelector } from 'react-redux';
import { RootState } from '../store';

/**
 * A wrapper around useSelector tied to the RootState.
 */
export const useStoreState = <T>(
  selector: (state: RootState) => T,
  equalityFn?: (left: T, right: T) => boolean
) => useSelector<RootState, T>(selector, equalityFn);
