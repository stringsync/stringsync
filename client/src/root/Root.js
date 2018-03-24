import React from 'react';
import { App } from './';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { compose, setPropTypes, setDisplayName } from 'recompose';
import { LocaleProvider } from 'antd';
import { ThemeProvider } from 'emotion-theming';
import enUS from 'antd/lib/locale-provider/en_US.js';
import PropTypes from 'prop-types';

const enhance = compose(
  setDisplayName('Root'),
  setPropTypes({
    store: PropTypes.object
  })
);

const theme = {
  primaryColor: '#FC354C',
  secondaryColor: '#B3FB66',
  tertiaryColor: '#0ABFBC',
  quaternaryColor: '#039E9E',
  borderColor: '#AAAAAA'
};

/**
 * This component wraps the App component with general functionality and providers.
 */
const Root = enhance(props => (
  <Provider store={props.store}>
    <BrowserRouter>
      <LocaleProvider locale={enUS}>
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </LocaleProvider>
    </BrowserRouter>
  </Provider>
));

export default Root;
