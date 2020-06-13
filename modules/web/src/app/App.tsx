import React from 'react';
import { Routes } from './routes';
import { BrowserRouter } from 'react-router-dom';
import { Provider as StoreProvider } from 'react-redux';
import { Store } from 'redux';
import { ConfigProvider } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';
import { ThemeProvider } from 'styled-components';
import { theme } from '../theme';

type Props = {
  store: Store;
};

export const App: React.FC<Props> = (props) => {
  return (
    <div data-testid="app">
      <StoreProvider store={props.store}>
        <ConfigProvider locale={enUS}>
          <ThemeProvider theme={theme}>
            <BrowserRouter>
              <Routes />
            </BrowserRouter>
          </ThemeProvider>
        </ConfigProvider>
      </StoreProvider>
    </div>
  );
};
