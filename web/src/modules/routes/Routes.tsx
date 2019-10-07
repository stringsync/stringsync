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
  withAuthRequirement(AuthRequirements.NONE),
  withScrollRestoration,
  withFallback
)(Library);

const WrappedSignup = compose(
  withAuthRequirement(AuthRequirements.LOGGED_OUT),
  withScrollRestoration,
  withFallback
)(React.lazy(() => import('../signup/Signup')));

const WrappedLogin = compose(
  withAuthRequirement(AuthRequirements.LOGGED_OUT),
  withScrollRestoration,
  withFallback
)(React.lazy(() => import('../login/Login')));

const Routes: React.FC = () => {
  return (
    <Router>
      <Route path="/" exact component={Landing} />
      <Route path="/library" component={WrappedLibrary} />
      <Route path="/signup" component={WrappedSignup} />
      <Route path="/login" component={WrappedLogin} />
    </Router>
  );
};

export default Routes;
