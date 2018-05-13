import React from 'react';
import styled from 'react-emotion';
import { Button, Icon } from 'antd';
import GoogleIconSrc from 'assets/google-logo-icon-36x36.png';
import { compose, withHandlers, withState } from 'recompose';
import { facebookLogin, googleLogin } from 'data';
import { connect } from 'react-redux';
import { sessionActions } from 'data';

const enhance = compose(
  withState('facebookLoading', 'setFacebookLoading', false),
  withState('googleLoading', 'setGoogleLoading', false),
  connect(
    null,
    dispatch => ({
      setSession: user => dispatch(sessionActions.session.set(user)),
      facebookLogin: (onSuccess, onError) => dispatch(facebookLogin(onSuccess, onError)),
      googleLogin: (onSuccess, onError) => dispatch(googleLogin(onSuccess, onError))
    })
  ),
  withHandlers({
    handleSuccess: props => res => {
      props.setFacebookLoading(false);
      props.setGoogleLoading(false);
      props.setSession(res);
      window.ss.message.success(`signed in as ${res.name}`);
    },
    handleError: props => res => {
      props.setFacebookLoading(false);
      props.setGoogleLoading(false);
      window.ss.message.error('Could not sign in.');
    }
  }),
  withHandlers({
    handleFacebookClick: props => event => {
      props.setFacebookLoading(true);
      props.facebookLogin(props.handleSuccess, props.handleError);
    },
    handleGoogleClick: props => event => {
      props.setGoogleLoading(true);
      props.googleLogin(props.handleSuccess, props.handleError);
    }
  })
);

const GoogleButton = styled(Button) `
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;

  && {
    background-color: white;
    color: rgba(0, 0, 0, 0.65);
  }
`;

const GoogleLogo = styled('img') `
  width: 14px;
  margin-right: 4px;
`;

const FacebookButton = styled(Button) `
  width: 100%;

  && {
    color: white;
    background-color: #3f5692;
  }
`;

const ProviderButtons = enhance(props => (
  <div>
    <GoogleButton
      onClick={props.handleGoogleClick}
      loading={props.googleLoading}
    >
      <GoogleLogo src={GoogleIconSrc} alt="google-icon" />
      Google
    </GoogleButton>
    <FacebookButton
      onClick={props.handleFacebookClick}
      loading={props.facebookLoading}
    >
      <Icon type="facebook" />
      Facebook
    </FacebookButton>
  </div>
));

export default ProviderButtons;
