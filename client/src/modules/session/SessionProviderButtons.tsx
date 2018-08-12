import * as React from 'react';
import styled from 'react-emotion';
import { Button, Icon } from 'antd';
import GoogleIconSrc from 'assets/google-logo-icon-36x36.png';
import { compose, withHandlers, withState } from 'recompose';
import { oAuthLogin } from 'data';
import { connect } from 'react-redux';
import { registerServiceWorker, unregisterServiceWorker } from 'utilities';

interface IInnerProps {
  facebookLoading: boolean;
  googleLoading: boolean;
  setFacebookLoading: (facebookLoading: boolean) => void;
  setGoogleLoading: (googleLoading: boolean) => void; 
  facebookLogin: () => User.ISessionUser;
  googleLogin: () => User.ISessionUser;
  handleError: () => void;
  handleSuccess: (user: User.ISessionUser) => void;
  handleFacebookClick: () => User.ISessionUser;
  handleGoogleClick: () => User.ISessionUser;
}

const enhance = compose<IInnerProps, {}>(
  withState('facebookLoading', 'setFacebookLoading', false),
  withState('googleLoading', 'setGoogleLoading', false),
  connect(
    null,
    dispatch => ({
      facebookLogin: () => dispatch(oAuthLogin('facebook') as any),
      googleLogin: () => dispatch(oAuthLogin('google') as any)
    })
  ),
  withHandlers({
    handleError: (props: any) => () => {
      props.setFacebookLoading(false);
      props.setGoogleLoading(false);
      window.ss.message.error('could not sign in');
    },
    handleSuccess: () => (user: User.ISessionUser) => {
      // should redirect to the library
      window.ss.message.info(`signed in as ${user.name}`);
    }
  }),
  withHandlers({
    handleFacebookClick: (props: any) => async () => {
      unregisterServiceWorker();
      props.setFacebookLoading(true);

      try {
        const user = await props.facebookLogin();
        props.handleSuccess(user);
      } catch (error) {
        console.error(error);
        props.handleError();
      }

      registerServiceWorker();
    },
    handleGoogleClick: (props: any) => async () => {
      unregisterServiceWorker();
      props.setGoogleLoading(true);

      try {
        const user = await props.googleLogin();
        props.handleSuccess(user);
      } catch (error) {
        console.error(error);
        props.handleError(error);
      }

      registerServiceWorker();
    }
  })
);

const GoogleButton = styled(Button)`
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

const GoogleLogo = styled('img')`
  width: 14px;
  margin-right: 4px;
`;

const FacebookButton = styled(Button)`
  width: 100%;

  && {
    color: white;
    background-color: #3f5692;
  }
`;

export const SessionProviderButtons = enhance(props => (
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
