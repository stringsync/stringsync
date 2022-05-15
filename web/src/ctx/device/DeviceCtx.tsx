import { createAction, createReducer } from '@reduxjs/toolkit';
import React, { PropsWithChildren, useReducer } from 'react';
import { useEffectOnce } from '../../hooks/useEffectOnce';
import { getDevice } from './getDevice';
import { Device } from './types';

const DEVICE_ACTIONS = {
  setDevice: createAction<{ device: Device }>('setDevice'),
};

const INITIAL_USER_AGENT = navigator.userAgent || '';

const getInitialState = (): Device => getDevice(INITIAL_USER_AGENT);

const deviceReducer = createReducer(getInitialState(), (builder) => {
  builder.addCase(DEVICE_ACTIONS.setDevice, (state, action) => {
    return action.payload.device;
  });
});

export const DeviceCtx = React.createContext<Device>(getInitialState());

export const DeviceProvider: React.FC<PropsWithChildren<{}>> = (props) => {
  const [state, dispatch] = useReducer(deviceReducer, getInitialState());

  useEffectOnce(() => {
    const device = getDevice(navigator.userAgent || '');
    dispatch(DEVICE_ACTIONS.setDevice({ device }));
  });

  return <DeviceCtx.Provider value={state}>{props.children}</DeviceCtx.Provider>;
};
