import React from 'react';
import { compose, AuthRequirement } from '@stringsync/common';
import { Route } from 'react-router-dom';
import { Landing } from './Landing';
import { Fallback } from './Fallback';
import { asReturnToRoute, withAuthRequirement } from '../../hocs';

const Library = compose(
  asReturnToRoute,
  withAuthRequirement(AuthRequirement.NONE)
)(React.lazy(() => import('./Library')));

const Signup = compose(withAuthRequirement(AuthRequirement.LOGGED_OUT))(React.lazy(() => import('./Signup')));

const Login = compose(withAuthRequirement(AuthRequirement.LOGGED_OUT))(React.lazy(() => import('./Login')));

const ReqPasswordReset = compose(withAuthRequirement(AuthRequirement.LOGGED_OUT))(
  React.lazy(() => import('./ReqPasswordReset'))
);

export const Routes: React.FC = () => {
  return (
    <React.Suspense fallback={<Fallback />}>
      <Route path="/" exact component={Landing} />
      <Route path="/library" component={Library} />
      <Route path="/signup" component={Signup} />
      <Route path="/login" component={Login} />
      <Route path="/request-password-reset" component={ReqPasswordReset} />
    </React.Suspense>
  );
};
