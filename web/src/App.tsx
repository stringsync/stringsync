import { ConfigProvider } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import './App.less';
import { NewVersionNotifier } from './components/NewVerisionNotifier/NewVersionNotifier';
import { Routes } from './components/Routes';
import { DeviceProvider } from './ctx/device';
import { RouteInfoProvider } from './ctx/route-info';
import { ServiceWorkerProvider } from './ctx/service-worker';
import { ViewportProvider } from './ctx/viewport';
import { theme } from './theme';

export const App: React.FC = (props) => {
  return (
    <React.StrictMode>
      <ConfigProvider locale={enUS}>
        <ThemeProvider theme={theme}>
          <ViewportProvider>
            <DeviceProvider>
              <ServiceWorkerProvider>
                <BrowserRouter>
                  <RouteInfoProvider>
                    <NewVersionNotifier />
                    <Routes />
                  </RouteInfoProvider>
                </BrowserRouter>
              </ServiceWorkerProvider>
            </DeviceProvider>
          </ViewportProvider>
        </ThemeProvider>
      </ConfigProvider>
    </React.StrictMode>
  );
};
