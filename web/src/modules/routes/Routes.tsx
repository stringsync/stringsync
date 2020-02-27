import React from 'react';
import { Route } from 'react-router-dom';
import Landing from '../landing/Landing';
import Library from '../library/Library';
import { withScrollRestoration } from './withScrollRestoration';
import { compose } from '../../common';
import { withAuthRequirement, AuthRequirements } from './withAuthRequirement';

const WrappedLibrary = compose(
  withAuthRequirement(AuthRequirements.NONE),
  withScrollRestoration
)(Library);

const WrappedSignup = compose(
  withAuthRequirement(AuthRequirements.LOGGED_OUT),
  withScrollRestoration
)(React.lazy(() => import('../signup/Signup')));

const WrappedLogin = compose(
  withAuthRequirement(AuthRequirements.LOGGED_OUT),
  withScrollRestoration
)(React.lazy(() => import('../login/Login')));

const WrappedUpload = compose(
  withAuthRequirement(AuthRequirements.LOGGED_IN_AS_TEACHER),
  withScrollRestoration
)(React.lazy(() => import('../upload/Upload')));

const WrappedConfirmEmail = compose(
  withAuthRequirement(AuthRequirements.LOGGED_IN),
  withScrollRestoration
)(React.lazy(() => import('../confirm-email/ConfirmEmail')));

export const Routes: React.FC = () => {
  return (
    <>
      <Route path="/" exact component={Landing} />
      <Route path="/library" component={WrappedLibrary} />
      <Route path="/signup" component={WrappedSignup} />
      <Route path="/login" component={WrappedLogin} />
      <Route path="/upload" component={WrappedUpload} />
      <Route path="/confirm-email" component={WrappedConfirmEmail} />
    </>
  );
};
