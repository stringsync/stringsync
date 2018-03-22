import React from 'react';
import { Provider } from 'react-redux';
import { withRouter, BrowserRouter } from 'react-router-dom';

const scrollToTop = () => window.scrollTo(null, 0);

const App = props => (
  <Provider store={props.store}>
    <BrowserRouter>
      <div className="App">
        App
      </div>
    </BrowserRouter>
  </Provider>
);

export default App;
