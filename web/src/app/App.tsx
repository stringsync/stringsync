import { ConfigProvider } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';
import React from 'react';
import { Provider as StoreProvider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Store } from 'redux';
import { ThemeProvider } from 'styled-components';
import { theme } from '../theme';

type Props = {
  store: Store;
};

export const App: React.FC<Props> = (props) => {
  return (
    <StoreProvider data-testid="app" store={props.store}>
      <ConfigProvider locale={enUS}>
        <ThemeProvider theme={theme}>
          <BrowserRouter>{props.children}</BrowserRouter>
        </ThemeProvider>
      </ConfigProvider>
    </StoreProvider>
  );
};
