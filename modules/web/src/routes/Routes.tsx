import React from 'react';
import { Route } from 'react-router-dom';
import Landing from '../pages/Landing/Landing';
import Library from '../pages/Library/Library';
import { withScrollRestoration } from './withScrollRestoration';
import { compose, AuthRequirements } from '../common';
import { withAuthRequirement } from './withAuthRequirement';
import { asReturnToRoute } from './asReturnToRoute';

const WrappedLibrary = compose(
  asReturnToRoute,
  withAuthRequirement(AuthRequirements.NONE),
  withScrollRestoration
)(Library);

const WrappedUpload = compose(
  asReturnToRoute,
  withAuthRequirement(AuthRequirements.LOGGED_IN_AS_TEACHER),
  withScrollRestoration
)(React.lazy(() => import('../pages/Upload/Upload')));

const WrappedConfirmEmail = compose(
  asReturnToRoute,
  withAuthRequirement(AuthRequirements.LOGGED_IN),
  withScrollRestoration
)(React.lazy(() => import('../pages/ConfirmEmail/ConfirmEmail')));

export const Routes: React.FC = () => {
  return (
    <>
      <Route path="/" exact component={Landing} />
      <Route path="/library" component={WrappedLibrary} />
      <Route path="/upload" component={WrappedUpload} />
      <Route path="/confirm-email" component={WrappedConfirmEmail} />
    </>
  );
};
