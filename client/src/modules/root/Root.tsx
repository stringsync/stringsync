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
  <div id="root">
    <Provider store={props.store}>
      <BrowserRouter>
        <LocaleProvider locale={enUS}>
          <ThemeProvider theme={theme}>
            <App />
          </ThemeProvider>
        </LocaleProvider>
      </BrowserRouter>
    </Provider>
  </div>
);
