import React from 'react';
import { compose, AuthRequirement } from '@stringsync/common';
import { Route, Switch } from 'react-router-dom';
import { Landing } from './Landing';
import { Fallback } from './Fallback';
import { withAuthRequirement } from '../../hocs';
import { ReturnToRoute } from '../../components/ReturnToRoute';
import { NotFound } from './NotFound';

const Library = compose(withAuthRequirement(AuthRequirement.NONE))(React.lazy(() => import('./Library')));

const NotationPlayer = compose(withAuthRequirement(AuthRequirement.NONE))(React.lazy(() => import('./NotationPlayer')));

const Signup = compose(withAuthRequirement(AuthRequirement.LOGGED_OUT))(React.lazy(() => import('./Signup')));

const Login = compose(withAuthRequirement(AuthRequirement.LOGGED_OUT))(React.lazy(() => import('./Login')));

const ForgotPassword = compose(withAuthRequirement(AuthRequirement.LOGGED_OUT))(
  React.lazy(() => import('./ForgotPassword'))
);

const Upload = compose(withAuthRequirement(AuthRequirement.LOGGED_IN_AS_TEACHER))(React.lazy(() => import('./Upload')));

export const Routes: React.FC = () => {
  return (
    <React.Suspense fallback={<Fallback />}>
      <Switch>
        <Route path="/" exact component={Landing} />
        <ReturnToRoute path="/library" component={Library} />
        <ReturnToRoute path="/n/:id" component={NotationPlayer} />
        <Route path="/signup" component={Signup} />
        <Route path="/login" component={Login} />
        <Route path="/forgot-password" component={ForgotPassword} />
        <ReturnToRoute path="/upload" component={Upload} />
        <Route path="*" component={NotFound} />
      </Switch>
    </React.Suspense>
  );
};
