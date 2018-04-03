import * as React from 'react';
import enUS from 'antd/lib/locale-provider/en_US.js';
import { App, theme } from './';
import { BrowserRouter } from 'react-router-dom';
import { LocaleProvider } from 'antd';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'emotion-theming';
import { store } from 'data';

interface RootProps {
  store: typeof store;
}

// Sets up the Providers and other components that are common to all components
const Root: React.SFC<RootProps> = props => (
  <Provider store={props.store}>
    <BrowserRouter>
      <LocaleProvider locale={enUS}>
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </LocaleProvider>
    </BrowserRouter>
  </Provider>
);

export default Root;
