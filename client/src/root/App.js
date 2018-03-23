import React from 'react';
import { withRouter } from 'react-router-dom';
import { compose, setDisplayName, lifecycle } from 'recompose';

const enhance = compose(
  setDisplayName('App'),
  withRouter,
  lifecycle({
    componentDidMount() {
      // scroll to top on route change
      this.props.history.listen(() => window.scrollTo(null, 0));
    }
  })
);

/**
 * This component sets the routes and layout of the app.
 */
const App = enhance(props => (
  <main className="App">
    App
  </main>
));

export default App;
