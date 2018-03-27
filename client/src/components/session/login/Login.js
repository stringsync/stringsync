import React from 'react';
import styled from 'react-emotion';
import { compose, setDisplayName } from 'recompose';
import { FormWrapper } from 'components';
import { LoginForm } from './';

const enhance = compose(
  setDisplayName('Login'),
);

const Login = enhance(props => (
  <FormWrapper title="LOGIN">
    <LoginForm />
  </FormWrapper>
));

export default Login;
