import React from 'react';
import { compose, setDisplayName, lifecycle } from 'recompose';

const scrollToTop = () => window.scrollTo(null, 0);

const enhance = compose(
  setDisplayName('App'),
  lifecycle({
    componentDidMount: () => {

    }
  })
);

const App = enhance(props => (
  <main className="App">
    App
  </main>
));

export default App;
