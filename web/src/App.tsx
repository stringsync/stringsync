import { ConfigProvider } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';
import React from 'react';
import { Provider as StoreProvider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Store } from 'redux';
import { ThemeProvider } from 'styled-components';
import './App.less';
import { AuthSync } from './components/AuthSync';
import { Routes } from './components/Routes';
import { ServiceWorkerSync } from './components/ServiceWorkerSync/ServiceWorkerSync';
import { DeviceProvider } from './ctx/device/DeviceCtx';
import { ViewportProvider } from './ctx/viewport';
import { theme } from './theme';

type Props = {
  store: Store;
};

export const App: React.FC<Props> = (props) => {
  return (
    <React.StrictMode>
      <StoreProvider data-testid="app" store={props.store}>
        <ConfigProvider locale={enUS}>
          <ThemeProvider theme={theme}>
            <ViewportProvider>
              <DeviceProvider>
                <BrowserRouter>
                  <ServiceWorkerSync />
                  <AuthSync />
                  <Routes />
                </BrowserRouter>
              </DeviceProvider>
            </ViewportProvider>
          </ThemeProvider>
        </ConfigProvider>
      </StoreProvider>
    </React.StrictMode>
  );
};
