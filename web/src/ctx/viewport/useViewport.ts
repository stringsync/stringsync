import { useContext } from 'react';
import { ViewportCtx } from './ViewportCtx';

export const useViewport = () => useContext(ViewportCtx);
