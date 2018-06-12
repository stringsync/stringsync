import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { compose } from 'recompose';
import { connect } from 'react-redux';

const enhance = compose(
  connect(
    state => ({
      signedIn: state.session.signedIn
    })
  )
);

/**
 * This component is used to conditionally allow the mounting of a component solely
 * based on state.session.signedIn.
 * Specifying requireSignIn as true will require the user to be signed in to mount the component.
 * Specifying requireSignIn as false will require the user NOT to be signed in to mount the component.
 */
const AuthRoute = enhance(({ component: Component, requireSignIn, signedIn, ...restProps }) => (
  <Route
    {...restProps}
    render={
      props => {
        if (requireSignIn) {
          return signedIn ? <Component {...props} /> : <Redirect to="/login" />;
        } else {
          return signedIn ? <Redirect to="/" /> : <Component {...props} />;
        }
      }
    }
  />
));

export default AuthRoute;
