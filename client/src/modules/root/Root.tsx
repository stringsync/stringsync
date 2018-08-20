import * as React from 'react';
import { Store } from 'react-redux';
import enUS from 'antd/lib/locale-provider/en_US';
import { BrowserRouter } from 'react-router-dom';
import { LocaleProvider } from 'antd';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'emotion-theming';
import { App } from 'modules/app';

interface IRootProps {
  store: Store<Store.IState>
}

const THEME = Object.freeze({
  borderColor: '#EFEFEF',
  primaryColor: '#FC354C',
  quaternaryColor: '#161616',
  secondaryColor: '#6CABBA',
  tertiaryColor: '#F4F4F4'
});

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
