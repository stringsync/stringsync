import * as React from 'react';
import { App } from '../app';
import enUS from 'antd/lib/locale-provider/en_US';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { LocaleProvider } from 'antd';
import { ThemeProvider } from 'emotion-theming';
import theme from '../../theme';

interface IProps {
  store: any;
}

export const Root: React.SFC<IProps> = (props) => (
  <LocaleProvider locale={enUS}>
    <Provider store={props.store}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  </LocaleProvider>
);
