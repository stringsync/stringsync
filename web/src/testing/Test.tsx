import { ConfigProvider } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { ViewportProvider } from '../ctx/viewport';
import { theme } from '../theme';

export const Test: React.FC = (props) => {
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
