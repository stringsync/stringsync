import * as React from 'react';
import { SessionFormWrapper } from 'modules/session';
import { SignupForm } from './SignupForm';

export const Signup = () => (
  <SessionFormWrapper title="Signup">
    <SignupForm />
  </SessionFormWrapper>
);
