import React from 'react';
import { Route } from 'react-router-dom';
import Landing from '../landing/Landing';
import Library from '../library/Library';
import withFallback from './withFallback';
import withScrollRestoration from './withScrollRestoration';
import Router from './Router';
import compose from '../../util/compose';
import withAuthRequirement, { AuthRequirements } from './withAuthRequirement';

const WrappedLibrary = compose(
  withFallback,
  withAuthRequirement(AuthRequirements.NONE),
  withScrollRestoration
)(Library);

const WrappedSignup = compose(
  withFallback,
  withAuthRequirement(AuthRequirements.LOGGED_OUT),
  withScrollRestoration
)(React.lazy(() => import('../signup/Signup')));

const WrappedLogin = compose(
  withFallback,
  withAuthRequirement(AuthRequirements.LOGGED_OUT),
  withScrollRestoration
)(React.lazy(() => import('../login/Login')));

const WrappedUpload = compose(
  withFallback,
  withAuthRequirement(AuthRequirements.LOGGED_IN_AS_TEACHER),
  withScrollRestoration
)(React.lazy(() => import('../upload/Upload')));

const Routes: React.FC = () => {
  return (
    <Router>
      <Route path="/" exact component={Landing} />
      <Route path="/library" component={WrappedLibrary} />
      <Route path="/signup" component={WrappedSignup} />
      <Route path="/login" component={WrappedLogin} />
      <Route path="/upload" component={WrappedUpload} />
    </Router>
  );
};

export default Routes;
