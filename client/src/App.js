import React from 'react';
import logo from './logo.svg';
import configureAuth from './configureAuth';
import { compose, lifecycle } from 'recompose';

const enhance = compose(
  lifecycle({
    componentDidMount() {
      configureAuth();
    }
  })
)

const App = enhance(() => (
  <div className="App">
    App
  </div>
));

export default App;
