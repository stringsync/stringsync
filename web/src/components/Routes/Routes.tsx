import React from 'react';
import { Navigate, Route, Routes as Switch } from 'react-router-dom';
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

const NotationShow = compose(withAuthRequirement(AuthRequirement.NONE))(React.lazy(() => import('../NotationShow')));

const NotationEdit = compose(withAuthRequirement(AuthRequirement.LOGGED_IN_AS_TEACHER))(
  React.lazy(() => import('../NotationEdit'))
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

const UserIndex = compose(withAuthRequirement(AuthRequirement.LOGGED_IN_AS_ADMIN))(
  React.lazy(() => import('../UserIndex'))
);

const TagIndex = compose(withAuthRequirement(AuthRequirement.LOGGED_IN_AS_ADMIN))(
  React.lazy(() => import('../TagIndex'))
);

export const Routes: React.FC = () => {
  const { shouldRedirectFromLandingToLibrary, recordLandingVisit } = useRoutingBehavior();

  useScrollToTopOnRouteChange();

  return (
    <React.Suspense fallback={<Fallback />}>
      <Switch>
        <Route path="/index.html" element={<Navigate to="/" replace />} />
        <Route
          path="/"
          element={
            shouldRedirectFromLandingToLibrary ? (
              <Navigate to="/library" replace />
            ) : (
              <Landing recordLandingVisit={recordLandingVisit} />
            )
          }
        ></Route>
        <Route path="/library" element={<Library />} />
        <Route path="/n/:id" element={<NotationShow />} />
        <Route path="/n/:id/edit" element={<NotationEdit />} />
        <Route path="/users" element={<UserIndex />} />
        <Route path="/tags" element={<TagIndex />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/confirm-email" element={<ConfirmEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/200.html" element={<Nothing />} />
        <Route path="*" element={<NotFound />} />
      </Switch>
    </React.Suspense>
  );
};
