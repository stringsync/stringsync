import { ConfigProvider } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';
import React from 'react';
import { Provider as StoreProvider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Store } from 'redux';
import { ThemeProvider } from 'styled-components';
import './App.less';
import { AuthSync } from './components/AuthSync';
import { DeviceSync } from './components/DeviceSync';
import { Routes } from './components/Routes2';
import { ScrollToTop } from './components/ScrollToTop';
import { ServiceWorkerSync } from './components/ServiceWorkerSync';
import { ViewportSync } from './components/ViewportSync';
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
            <BrowserRouter>
              <ServiceWorkerSync />
              <DeviceSync />
              <ViewportSync />
              <AuthSync />
              <ScrollToTop />
              <Routes />
            </BrowserRouter>
          </ThemeProvider>
        </ConfigProvider>
      </StoreProvider>
    </React.StrictMode>
  );
};
