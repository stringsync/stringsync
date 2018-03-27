import React from 'react';
import styled from 'react-emotion';
import { compose, setDisplayName } from 'recompose';
import { FormWrapper } from 'components';
import { LoginForm } from './';
import { Button, Icon } from 'antd';
import GoogleIconSrc from 'assets/google-logo-icon-36x36.png';

const enhance = compose(
  setDisplayName('Login'),
);

const GoogleButton = styled(Button)`
  background: white;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
`;

const GoogleLogo = styled('img')`
  width: 14px;
  margin-right: 4px;
`;

const FacebookButton = styled(Button)`
  color: white;
  width: 100%;
  background: #3f5692;
`;

const OrContainer = styled('div')`
  text-align: center;
  margin: 0;
  margin-bottom: 10px;
  clear: both;
`;

const OrDiv = styled('div')`
  display: inline-block;
  font-size: 10px;
  padding: 10px;
  text-align: center;
  position: relative;
  background-color: white;
`;

const OrHr = styled('hr')`
  height: 0;
  border: 0;
  border-top: 1px solid ${props => props.theme.borderColor};
  position: relative;
  top: 25px;
`;

const Login = enhance(props => (
  <FormWrapper title="LOGIN">
    <GoogleButton>
      <GoogleLogo src={GoogleIconSrc} alt="google-icon" />
      Google
    </GoogleButton>
    <FacebookButton>
      <Icon type="facebook" />
      Facebook
    </FacebookButton>
    <OrContainer>
      <OrHr />
      <OrDiv>or</OrDiv>
    </OrContainer>
    <LoginForm />
  </FormWrapper>
));

export default Login;
