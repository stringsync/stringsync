import React from 'react';
import { ClientProvider } from './ClientProvider';
import { ConfigProvider } from 'antd';
import { Provider as StoreProvider } from 'react-redux';
import { Store } from '../../store';
import { ThemeProvider } from 'styled-components';
import enUS from 'antd/lib/locale-provider/en_US';
import { theme } from '../../theme';
import { BrowserRouter } from 'react-router-dom';
import { Fallback } from './Fallback';
import { StringSyncClient } from '../../client';

interface Props {
  store: Store;
  client: StringSyncClient;
}

const Root: React.FC<Props> = (props) => {
  return (
    <StoreProvider store={props.store}>
      <ClientProvider client={props.client}>
        <ConfigProvider locale={enUS}>
          <ThemeProvider theme={theme}>
            <BrowserRouter>
              <React.Suspense fallback={<Fallback />}>
                {props.children}
              </React.Suspense>
            </BrowserRouter>
          </ThemeProvider>
        </ConfigProvider>
      </ClientProvider>
    </StoreProvider>
  );
};

export default Root;
