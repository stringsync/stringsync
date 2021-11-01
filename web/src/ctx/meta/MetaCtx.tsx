import { createAction, createReducer } from '@reduxjs/toolkit';
import React, { useReducer } from 'react';
import { useEffectOnce } from '../../hooks/useEffectOnce';

export type MetaState = {
  version: string;
};

const META_ACTIONS = {
  setVersion: createAction<{ version: string }>('setVersion'),
};

const getVersion = (): string => {
  const metas = document.getElementsByTagName('meta');
  const version = metas.namedItem('version')?.content || '';
  return version ? `v${version}` : 'v?.?,?';
};

const getInitialState = (): MetaState => ({
  version: getVersion(),
});

const metaReducer = createReducer(getInitialState(), (builder) => {
  builder.addCase(META_ACTIONS.setVersion, (state, action) => {
    state.version = action.payload.version;
  });
});

export const MetaCtx = React.createContext<MetaState>(getInitialState());

export const MetaProvider: React.FC = (props) => {
  const [state, dispatch] = useReducer(metaReducer, getInitialState());

  useEffectOnce(() => {
    const version = getVersion();
    dispatch(META_ACTIONS.setVersion({ version }));
  });

  return <MetaCtx.Provider value={state}>{props.children}</MetaCtx.Provider>;
};
