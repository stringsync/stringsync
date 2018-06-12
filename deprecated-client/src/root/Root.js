import React from 'react';
import PropTypes from 'prop-types';
import enUS from 'antd/lib/locale-provider/en_US.js';
import { App } from './';
import { BrowserRouter } from 'react-router-dom';
import { LocaleProvider } from 'antd';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'emotion-theming';
import { compose, setPropTypes, setDisplayName } from 'recompose';

const enhance = compose(
  setDisplayName('Root'),
  setPropTypes({
    store: PropTypes.object
  })
);

const theme = {
  primaryColor: '#FC354C',
  secondaryColor: '#6CABBA',
  tertiaryColor: '#F4F4F4',
  quaternaryColor: '#161616',
  borderColor: '#EFEFEF'
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
