import React from 'react';
import { compose, withHandlers } from 'recompose';

const enhance = compose(
  withHandlers({
    handleButtonClick: props => event => {
      window.auth.oAuthSignIn({ provider: 'facebook' })
    }
  })
)

const App = enhance(props => (
  <div className="App">
    {JSON.stringify(window.auth.user)}
    <button onClick={props.handleButtonClick}>Login</button>
  </div>
));

export default App;
