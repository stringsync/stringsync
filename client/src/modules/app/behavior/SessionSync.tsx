import * as React from 'react';
import { connect } from 'react-redux';
import { compose, createSink } from 'recompose';
import { SessionActions } from '../../../data/session/sessionActions';

interface IProps {
  login: (user: User.ISession) => void;
}

const enhance = compose(
  connect(
    null,
    dispatch => ({
      login: (user: User.ISession) => dispatch(SessionActions.setSession(user))
    })
  )
);

// createSink forces the props to be Object, so we have this type casting workaround.
const Sink = createSink((props: any) => {
  window.ss.sessionSync.callback = (props as IProps).login;

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
