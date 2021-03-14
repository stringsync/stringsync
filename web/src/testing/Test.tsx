import { ConfigProvider } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';
import React, { useMemo } from 'react';
import { Provider as StoreProvider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { AppStore, createStore } from '../store';
import { theme } from '../theme';

type Props = {
  store?: AppStore;
};

export const Test: React.FC<Props> = (props) => {
  const store = useMemo(() => {
    return props.store || createStore();
  }, [props.store]);
  return (
    <StoreProvider data-testid="app" store={store}>
      <ConfigProvider locale={enUS}>
        <ThemeProvider theme={theme}>
          <BrowserRouter>{props.children}</BrowserRouter>
        </ThemeProvider>
      </ConfigProvider>
    </StoreProvider>
  );
};
