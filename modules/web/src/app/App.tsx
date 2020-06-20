import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider as StoreProvider } from 'react-redux';
import { Store } from 'redux';
import { ConfigProvider } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';
import { ThemeProvider } from 'styled-components';
import { theme } from '../theme';
import { ClientsProvider } from '../clients';

type Props = {
  store: Store;
};

export const App: React.FC<Props> = (props) => {
  return (
    <StoreProvider data-testid="app" store={props.store}>
      <ConfigProvider locale={enUS}>
        <ThemeProvider theme={theme}>
          <ClientsProvider>
            <BrowserRouter>{props.children}</BrowserRouter>
          </ClientsProvider>
        </ThemeProvider>
      </ConfigProvider>
    </StoreProvider>
  );
};
