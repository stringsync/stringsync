import { ConfigProvider } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';
import React, { PropsWithChildren } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider as ThemeProvider_ } from 'styled-components';
import { ViewportProvider } from '../ctx/viewport';
import { theme } from '../theme';

const ThemeProvider = ThemeProvider_ as any;

export const Test: React.FC<PropsWithChildren<{}>> = (props) => {
  return (
    <ConfigProvider locale={enUS}>
      <ThemeProvider theme={theme}>
        <ViewportProvider>
          <BrowserRouter>{props.children}</BrowserRouter>
        </ViewportProvider>
      </ThemeProvider>
    </ConfigProvider>
  );
};
