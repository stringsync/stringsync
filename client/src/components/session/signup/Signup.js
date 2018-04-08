import React from 'react';
import { compose, setDisplayName } from 'recompose';
import { SessionFormWrapper } from 'components';
import { SignupForm } from './';

const enhance = compose(
  setDisplayName('Signup'),
);

const Signup = enhance(props => (
  <SessionFormWrapper title="Signup">
    <SignupForm />
  </SessionFormWrapper>
));

export default Signup;
