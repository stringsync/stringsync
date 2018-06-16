import React from 'react';
import { connect } from 'react-redux';
import { compose, createSink } from 'recompose';
import { sessionActions } from 'data';

const enhance = compose(
  connect(
    null,
    dispatch => ({
      login: user => dispatch(sessionActions.session.set(user))
    })
  )
);

const Sink = createSink(props => {
  window.ss.sessionSync.callback = props.login; 

  // If the sessionSync does not have a signedIn user object, then there
  // is still a chance for the login callback to be called after the tokens get
  // validated. See configureAuth.js to see how the ss.session.callback can
  // get used.
  const { user } = window.ss.sessionSyRoutesnc;
  if (user.signedIn) {
    props.login(user);
  }
});

const SessionSync = enhance(props => <Sink {...props} />);

export default SessionSync;
