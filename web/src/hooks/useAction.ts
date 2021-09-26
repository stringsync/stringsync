import { createAction } from '@reduxjs/toolkit';
import { useMemo } from 'react';

export const useAction = <P = void, T extends string = string>(type: T) => {
  return useMemo(() => createAction<P, T>(type), [type]);
};
