import React from 'react';
import styled from 'react-emotion';
import { compose, setDisplayName } from 'recompose';
import { SessionFormWrapper } from 'components';
import { LoginForm } from './';

const enhance = compose(
  setDisplayName('Login'),
);

const Login = enhance(props => (
  <SessionFormWrapper title="Login">
    <LoginForm />
  </SessionFormWrapper>
));

export default Login;
