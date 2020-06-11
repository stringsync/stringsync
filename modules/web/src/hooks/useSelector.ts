import { useSelector as _useSelector } from 'react-redux';
import { RootState } from '../store';

/**
 * A wrapper around useSelector tied to the RootState.
 */
export const useSelector = <T>(
  selector: (state: RootState) => T,
  equalityFn?: (left: T, right: T) => boolean
) => _useSelector<RootState, T>(selector, equalityFn);
