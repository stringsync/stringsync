import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { withAuthRequirement } from '../../hocs/withAuthRequirement';
import { useScrollToTopOnRouteChange } from '../../hooks/useScrollToTopOnRouteChange';
import { compose } from '../../util/compose';
import { AuthRequirement } from '../../util/types';
import { Fallback } from '../Fallback';
import { Landing } from '../Landing';
import { NotFound } from '../NotFound';
import { Nothing } from '../Nothing/Nothing';
import { useRoutingBehavior } from './useRoutingBehavior';

const Library = compose(withAuthRequirement(AuthRequirement.NONE))(React.lazy(() => import('../Library')));

const NotationPlayer = compose(withAuthRequirement(AuthRequirement.NONE))(
  React.lazy(() => import('../NotationPlayer'))
);

const NotationEditor = compose(withAuthRequirement(AuthRequirement.LOGGED_IN_AS_TEACHER))(
  React.lazy(() => import('../NotationEditor'))
);

const Signup = compose(withAuthRequirement(AuthRequirement.LOGGED_OUT))(React.lazy(() => import('../Signup')));

const Login = compose(withAuthRequirement(AuthRequirement.LOGGED_OUT))(React.lazy(() => import('../Login')));

const ConfirmEmail = compose(withAuthRequirement(AuthRequirement.LOGGED_IN))(
  React.lazy(() => import('../ConfirmEmail'))
);

const ForgotPassword = compose(withAuthRequirement(AuthRequirement.LOGGED_OUT))(
  React.lazy(() => import('../ForgotPassword'))
);

const ResetPassword = compose(withAuthRequirement(AuthRequirement.LOGGED_OUT))(
  React.lazy(() => import('../ResetPassword'))
);

const Upload = compose(withAuthRequirement(AuthRequirement.LOGGED_IN_AS_TEACHER))(
  React.lazy(() => import('../Upload'))
);

export const Routes: React.FC = () => {
  const { shouldRedirectFromLandingToLibrary, recordLandingVisit } = useRoutingBehavior();

  useScrollToTopOnRouteChange();

  return (
    <React.Suspense fallback={<Fallback />}>
      <Switch>
        <Route path="/index.html" exact>
          <Redirect to="/" />
        </Route>
        <Route path="/" exact>
          {shouldRedirectFromLandingToLibrary ? (
            <Redirect to="/library" />
          ) : (
            <Landing recordLandingVisit={recordLandingVisit} />
          )}
        </Route>
        <Route exact path="/library" component={Library} />
        <Route exact path="/n/:id" component={NotationPlayer} />
        <Route exact path="/n/:id/edit" component={NotationEditor} />
        <Route path="/signup" component={Signup} />
        <Route path="/login" component={Login} />
        <Route path="/confirm-email" component={ConfirmEmail} />
        <Route path="/forgot-password" component={ForgotPassword} />
        <Route path="/reset-password" component={ResetPassword} />
        <Route path="/upload" component={Upload} />
        <Route path="/200.html" component={Nothing} />
        <Route path="*" component={NotFound} />
      </Switch>
    </React.Suspense>
  );
};
