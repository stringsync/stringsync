import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Nothing } from '../../components/Nothing';
import { ReturnToRoute } from '../../components/ReturnToRoute';
import { withAuthRequirement } from '../../hocs';
import { compose } from '../../util/compose';
import { AuthRequirement } from '../../util/types';
import { Fallback } from './Fallback';
import { Landing } from './Landing';
import { NotFound } from './NotFound';

const Library = compose(withAuthRequirement(AuthRequirement.NONE))(React.lazy(() => import('./Library')));

const NotationPlayer = compose(withAuthRequirement(AuthRequirement.NONE))(React.lazy(() => import('./NotationPlayer')));

const Signup = compose(withAuthRequirement(AuthRequirement.LOGGED_OUT))(React.lazy(() => import('./Signup')));

const Login = compose(withAuthRequirement(AuthRequirement.LOGGED_OUT))(React.lazy(() => import('./Login')));

const ConfirmEmail = compose(withAuthRequirement(AuthRequirement.LOGGED_IN))(
  React.lazy(() => import('./ConfirmEmail'))
);

const ForgotPassword = compose(withAuthRequirement(AuthRequirement.LOGGED_OUT))(
  React.lazy(() => import('./ForgotPassword'))
);

const ResetPassword = compose(withAuthRequirement(AuthRequirement.LOGGED_OUT))(
  React.lazy(() => import('./ResetPassword'))
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
        <Route path="/confirm-email" component={ConfirmEmail} />
        <Route path="/forgot-password" component={ForgotPassword} />
        <Route path="/reset-password" component={ResetPassword} />
        <ReturnToRoute path="/upload" component={Upload} />
        <Route path="/200.html" component={Nothing} />
        <Route path="*" component={NotFound} />
      </Switch>
    </React.Suspense>
  );
};
