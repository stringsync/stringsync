import * as React from 'react';
import { Store } from 'react-redux';
import enUS from 'antd/lib/locale-provider/en_US';
import { BrowserRouter } from 'react-router-dom';
import { LocaleProvider } from 'antd';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'emotion-theming';
import THEME from 'constants/theme';
import { App } from 'modules/app';

interface IRootProps {
  store: Store<StringSync.Store.IState>
}

export const Root: React.SFC<IRootProps> = props => (
  <Provider store={props.store}>
    <BrowserRouter>
      <LocaleProvider locale={enUS}>
        <ThemeProvider theme={THEME}>
          <App />
        </ThemeProvider>
      </LocaleProvider>
    </BrowserRouter> 
  </Provider>
);
