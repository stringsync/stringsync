import * as React from 'react';
import { connect } from 'react-redux';
import { compose, createSink } from 'recompose';
import { SessionActions } from 'data/session';

interface ISinkProps {
  login: (user: User.ISessionUser) => void;
}

const enhance = compose(
  connect(
    null,
    dispatch => ({
      login: (user: User.ISessionUser) => dispatch(SessionActions.setSession(user))
    })
  )
);

const Sink = createSink((props: ISinkProps) => {
  window.ss.sessionSync.callback = props.login;

  // If the sessionSync does not have a signedIn user object, then there
  // is still a chance for the login callback to be called after the tokens get
  // validated. See configureAuth.js to see how the ss.session.callback can
  // get used.
  const { user } = window.ss.sessionSync;
  if (user.signedIn) {
    props.login(user);
  }
});

export const SessionSync = enhance(props => <Sink {...props} />);
