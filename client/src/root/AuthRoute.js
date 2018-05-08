import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { compose } from 'recompose';
import { connect } from 'react-redux';

const enhance = compose(
  connect(
    state => ({
      isSignedIn: state.session.signedIn
    })
  )
);

const AuthRoute = enhance(({ component: Component, requireSignIn, isSignedIn, ...restProps }) => (
  <Route
    {...restProps}
    render={
      props => {
        if (requireSignIn) {
          return isSignedIn ? <Component {...props} /> : <Redirect to="/login" />
        } else {
          return isSignedIn ? <Redirect to="/" /> : <Component {...props} />
        }
      }
    }
  />
));

export default AuthRoute;
