import { createAction, createReducer } from '@reduxjs/toolkit';
import React, { useReducer } from 'react';
import { useEffectOnce } from '../../hooks/useEffectOnce';
import { getDeviceState } from './getDeviceState';
import { DeviceState } from './types';

const DEVICE_ACTIONS = {
  setUserAgent: createAction<{ userAgent: string }>('setUserAgent'),
};

const INITIAL_USER_AGENT = navigator.userAgent || '';

const getInitialState = (): DeviceState => getDeviceState(INITIAL_USER_AGENT);

const deviceReducer = createReducer(getInitialState(), (builder) => {
  builder.addCase(DEVICE_ACTIONS.setUserAgent, (state, action) => {
    return getDeviceState(action.payload.userAgent);
  });
});

export const DeviceCtx = React.createContext<DeviceState>(getInitialState());

export const DeviceProvider: React.FC = (props) => {
  const [state, dispatch] = useReducer(deviceReducer, getInitialState());

  useEffectOnce(() => {
    dispatch(DEVICE_ACTIONS.setUserAgent({ userAgent: navigator.userAgent || '' }));
  });

  return <DeviceCtx.Provider value={state}></DeviceCtx.Provider>;
};
