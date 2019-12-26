import React from 'react';
import { ConfigProvider } from 'antd';
import { Provider as StoreProvider } from 'react-redux';
import { Store } from '../../store';
import { ThemeProvider } from 'styled-components';
import enUS from 'antd/lib/locale-provider/en_US';
import theme from '../../theme.json';
import { BrowserRouter } from 'react-router-dom';

interface Props {
  store: Store;
}

const Root: React.FC<Props> = (props) => {
  return (
    <StoreProvider store={props.store}>
      <ConfigProvider locale={enUS}>
        <ThemeProvider theme={theme}>
          <BrowserRouter>{props.children}</BrowserRouter>
        </ThemeProvider>
      </ConfigProvider>
    </StoreProvider>
  );
};

export default Root;
