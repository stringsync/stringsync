import * as React from 'react';
import { Store } from 'react-redux';
import enUS from 'antd/lib/locale-provider/en_US';
import { BrowserRouter } from 'react-router-dom';
import { LocaleProvider } from 'antd';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'emotion-theming';

interface IRootProps {
  store: Store<StringSync.StoreState>
}

const Root: React.SFC<IRootProps> = props => (
  <div>
    Hello, world!
  </div>
);

export default Root;