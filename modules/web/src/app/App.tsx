import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider as StoreProvider } from 'react-redux';
import { Store } from 'redux';
import { ConfigProvider } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';
import { ThemeProvider } from 'styled-components';
import { theme } from '../theme';
import { ClientsContext, Clients } from '../clients';

type Props = {
  store: Store;
  clients: Clients;
};

export const App: React.FC<Props> = (props) => {
  return (
    <StoreProvider data-testid="app" store={props.store}>
      <ConfigProvider locale={enUS}>
        <ThemeProvider theme={theme}>
          <ClientsContext.Provider value={props.clients}>
            <BrowserRouter>{props.children}</BrowserRouter>
          </ClientsContext.Provider>
        </ThemeProvider>
      </ConfigProvider>
    </StoreProvider>
  );
};
