import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { compose } from 'recompose';
import { connect } from 'react-redux';

const enhance = compose(
  connect(
    state => ({
      isSignedIn: state.session.isSignedIn
    })
  )
);

const AuthRoute = (Component, routeProps, requireSignIn) => (
  <Route
    {...routeProps}
    render={enhance(props => {
        if (requireSignIn) {
          return props.isSignedIn ? <Component {...props} /> : <Redirect to="/login" />
        } else {
          return props.isSignedIn ? <Redirect to="/" /> : <Component {...props} /> 
        }
      })
    }
  />
);

export default AuthRoute;
