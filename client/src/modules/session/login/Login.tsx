import * as React from 'react';
import { SessionFormWrapper } from 'modules/session';  
import { LoginForm } from './LoginForm';

export const Login = () => (
  <SessionFormWrapper title="Login">
    <LoginForm />
  </SessionFormWrapper>
);
