import * as React from 'react';
import { Store } from 'react-redux';
import enUS from 'antd/lib/locale-provider/en_US';
import { BrowserRouter } from 'react-router-dom';
import { LocaleProvider } from 'antd';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'emotion-theming';
import THEME from 'constants/theme';

interface IRootProps {
  store: Store<StringSync.StoreState>
}

const Root: React.SFC<IRootProps> = props => (
  <Provider store={props.store}>
    <BrowserRouter>
      <LocaleProvider locale={enUS}>
        <ThemeProvider theme={THEME}>
          <div>
            henlo
          </div>
        </ThemeProvider>
      </LocaleProvider>
    </BrowserRouter> 
  </Provider>
);

export default Root;