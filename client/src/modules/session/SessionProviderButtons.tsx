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
  facebookLogin: (onSuccess?: OAuthCallback, onError?: () => any) => void;
  googleLogin: (onSuccess?: OAuthCallback, onError?: () => any) => void;
  handleError: () => void;
  handleSuccess: (response: IAuthResponse) => void;
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
        dispatch(oAuthLogin('facebook', onSuccess, onError) as any)
      },
      googleLogin: (onSuccess?: OAuthCallback, onError?: () => any) => {
        dispatch(oAuthLogin('google', onSuccess, onError) as any)
      }
    })
  ),
  withHandlers({
    handleError: (props: any) => () => {
      props.setFacebookLoading(false);
      props.setGoogleLoading(false);
      window.ss.message.error('could not sign in');
    },
    handleSuccess: (props: any) => (res: IAuthResponse) => {
      props.setFacebookLoading(false);
      props.setGoogleLoading(false);
      window.ss.message.error(`signed in as ${res.data.name}`);
    }
  }),
  withHandlers({
    handleFacebookClick: (props: any) => (event: React.MouseEvent<HTMLButtonElement>) => {
      unregisterServiceWorker();
      props.setFacebookLoading(true);

      try {
        props.facebookLogin(props.handleSuccess, props.handleError);
      } catch (error) {
        console.error(error);
      }

      registerServiceWorker();
    },
    handleGoogleClick: (props: any) => (event: React.MouseEvent<HTMLButtonElement>) => {
      unregisterServiceWorker();
      props.setGoogleLoading(true);

      try {
        props.googleLogin(props.handleSuccess, props.handleError);
      } catch (error) {
        console.error(error);
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
