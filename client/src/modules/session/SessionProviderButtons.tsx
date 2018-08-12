import * as React from 'react';
import styled from 'react-emotion';
import { Button, Icon } from 'antd';
import GoogleIconSrc from 'assets/google-logo-icon-36x36.png';
import { compose, withHandlers, withState } from 'recompose';
import { oAuthLogin } from 'data';
import { connect } from 'react-redux';
import { SessionActions } from 'data';
import { registerServiceWorker, unregisterServiceWorker } from 'utilities';
import { OAuthCallback, IAuthResponse } from 'j-toker';

interface IInnerProps {
  facebookLoading: boolean;
  googleLoading: boolean;
  setFacebookLoading: (facebookLoading: boolean) => void;
  setGoogleLoading: (googleLoading: boolean) => void; 
  facebookLogin: () => User.ISessionUser;
  googleLogin: () => User.ISessionUser;
  handleError: () => void;
  handleSuccess: (user: User.ISessionUser) => void;
  handleFacebookClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  handleGoogleClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const enhance = compose<IInnerProps, {}>(
  withState('facebookLoading', 'setFacebookLoading', false),
  withState('googleLoading', 'setGoogleLoading', false),
  connect(
    null,
    dispatch => ({
      facebookLogin: (onSuccess?: OAuthCallback, onError?: () => any) => {
        dispatch(oAuthLogin('facebook') as any)
      },
      googleLogin: (onSuccess?: OAuthCallback, onError?: () => any) => {
        dispatch(oAuthLogin('google') as any)
      }
    })
  ),
  withHandlers({
    handleError: (props: any) => () => {
      props.setFacebookLoading(false);
      props.setGoogleLoading(false);
      window.ss.message.error('could not sign in');
    },
    handleSuccess: (props: any) => (user: User.ISessionUser) => {
      props.setFacebookLoading(false);
      props.setGoogleLoading(false);
      window.ss.message.error(`signed in as ${user.name}`);
    }
  }),
  withHandlers({
    handleFacebookClick: (props: any) => (event: React.MouseEvent<HTMLButtonElement>) => {
      unregisterServiceWorker();
      props.setFacebookLoading(true);

      try {
        const user = props.facebookLogin();
        props.handleSuccess(user);
      } catch (error) {
        console.error(error);
        props.handleError();
      }

      registerServiceWorker();
    },
    handleGoogleClick: (props: any) => (event: React.MouseEvent<HTMLButtonElement>) => {
      unregisterServiceWorker();
      props.setGoogleLoading(true);

      try {
        const user = props.googleLogin();
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
