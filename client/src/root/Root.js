import React from 'react';
import { App } from './';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { compose, setPropTypes, setDisplayName } from 'recompose';
import { LocaleProvider } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US.js';
import PropTypes from 'prop-types';

const enhance = compose(
  setDisplayName('Root'),
  setPropTypes({
    store: PropTypes.object
  })
)

const Root = enhance(props => (
  <div id="root">
    <Provider store={props.store}>
      <BrowserRouter>
        <LocaleProvider locale={enUS}>
          <App />
        </LocaleProvider>
      </BrowserRouter>
    </Provider>
  </div>
));

export default Root;
