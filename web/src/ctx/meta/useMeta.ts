import { useContext } from 'react';
import { MetaCtx } from './MetaCtx';

export const useMeta = () => {
  const state = useContext(MetaCtx);
  return state;
};
