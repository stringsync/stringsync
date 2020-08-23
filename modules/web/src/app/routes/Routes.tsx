import React from 'react';
import { compose, AuthRequirement } from '@stringsync/common';
import { Route } from 'react-router-dom';
import { Landing } from './Landing';
import { Fallback } from './Fallback';
import { withAuthRequirement } from '../../hocs';
import { ReturnToRoute } from '../../components/ReturnToRoute';

const Library = compose(withAuthRequirement(AuthRequirement.NONE))(React.lazy(() => import('./Library')));

const NotationPlayer = compose(withAuthRequirement(AuthRequirement.NONE))(React.lazy(() => import('./NotationPlayer')));

const Signup = compose(withAuthRequirement(AuthRequirement.LOGGED_OUT))(React.lazy(() => import('./Signup')));

const Login = compose(withAuthRequirement(AuthRequirement.LOGGED_OUT))(React.lazy(() => import('./Login')));

const ForgotPassword = compose(withAuthRequirement(AuthRequirement.LOGGED_OUT))(
  React.lazy(() => import('./ForgotPassword'))
);

export const Routes: React.FC = () => {
  return (
    <React.Suspense fallback={<Fallback />}>
      <Route path="/" exact component={Landing} />
      <ReturnToRoute path="/library" component={Library} />
      <ReturnToRoute path="/n/:id" component={NotationPlayer} />
      <Route path="/signup" component={Signup} />
      <Route path="/login" component={Login} />
      <Route path="/forgot-password" component={ForgotPassword} />
    </React.Suspense>
  );
};
