import * as React from 'react';
import styled from 'react-emotion';
import { Button, Icon } from 'antd';
import { compose, withHandlers, withState } from 'recompose';
import { connect } from 'react-redux';
import * as serviceWorker from '../../serviceWorker';
import { ISession } from '../../@types/user';

const oAuthLogin = (str: string) => str;

interface IInnerProps {
  facebookLoading: boolean;
  googleLoading: boolean;
  setFacebookLoading: (facebookLoading: boolean) => void;
  setGoogleLoading: (googleLoading: boolean) => void;
  facebookLogin: () => ISession;
  googleLogin: () => ISession;
  handleError: () => void;
  handleSuccess: (user: ISession) => void;
  handleFacebookClick: () => ISession;
  handleGoogleClick: () => ISession;
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
    handleSuccess: () => (user: ISession) => {
      // should redirect to the library
      window.ss.message.info(`signed in as ${user.name}`);
    }
  }),
  withHandlers({
    handleFacebookClick: (props: any) => async () => {
      serviceWorker.unregister();
      props.setFacebookLoading(true);

      try {
        const user = await props.facebookLogin();
        props.handleSuccess(user);
      } catch (error) {
        console.error(error);
        props.handleError();
      }

      serviceWorker.register();
    },
    handleGoogleClick: (props: any) => async () => {
      serviceWorker.unregister();
      props.setGoogleLoading(true);

      try {
        const user = await props.googleLogin();
        props.handleSuccess(user);
      } catch (error) {
        console.error(error);
        props.handleError(error);
      }

      serviceWorker.register();
    }
  })
);

const GoogleButton = styled<any>(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  && {
    background-color: white;
    color: rgba(0, 0, 0, 0.65);
  }
`;


const FacebookButton = styled<any>(Button)`
  && {
    color: white;
    background-color: #3f5692;
  }
`;

export const OAuthButtons = enhance(props => (
  <div>
    <GoogleButton
      onClick={props.handleGoogleClick}
      loading={props.googleLoading}
      size="large"
      block={true}
    >
      <Icon type="google" />
      Google
    </GoogleButton>
    <FacebookButton
      onClick={props.handleFacebookClick}
      loading={props.facebookLoading}
      size="large"
      block={true}
    >
      <Icon type="facebook" />
      Facebook
    </FacebookButton>
  </div>
));
