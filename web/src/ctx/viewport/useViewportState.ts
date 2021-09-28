import { useContext } from 'react';
import { ViewportCtx } from './ViewportCtx';

export const useViewportState = () => useContext(ViewportCtx);
