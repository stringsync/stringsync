import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Redirect, Route, Switch, useLocation } from 'react-router-dom';
import { withAuthRequirement } from '../../hocs';
import { AppDispatch, historySlice } from '../../store';
import { compose } from '../../util/compose';
import { AuthRequirement } from '../../util/types';
import { Fallback } from '../Fallback';
import { Nothing } from '../Nothing';
import { ReturnToRoute } from '../ReturnToRoute';
import { Landing } from './Landing';
import { NotFound } from './NotFound';

const Library = compose(withAuthRequirement(AuthRequirement.NONE))(React.lazy(() => import('./Library')));

const NotationPlayer = compose(withAuthRequirement(AuthRequirement.NONE))(React.lazy(() => import('./NotationPlayer')));

const NotationEditor = compose(withAuthRequirement(AuthRequirement.LOGGED_IN_AS_TEACHER))(
  React.lazy(() => import('./NotationEditor'))
);

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
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(
    () => () => {
      dispatch(historySlice.actions.setPrevRoute(location.pathname));
    },
    [dispatch, location]
  );

  return (
    <React.Suspense fallback={<Fallback />}>
      <Switch>
        <Route path="/index.html" exact>
          <Redirect to="/" />
        </Route>
        <Route path="/" exact component={Landing} />
        <ReturnToRoute exact path="/library" component={Library} />
        <ReturnToRoute exact path="/n/:id" component={NotationPlayer} />
        <ReturnToRoute exact path="/n/:id/edit" component={NotationEditor} />
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
