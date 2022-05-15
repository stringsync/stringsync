import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Fallback } from '../components/Fallback';
import { isLoggedInSelector, useAuth } from '../ctx/auth';
import { useRouteInfo } from '../ctx/route-info';
import { gtEqAdmin, gtEqStudent, gtEqTeacher } from '../domain';
import { UserRole } from '../graphql';
import { notify } from '../lib/notify';
import { AuthRequirement } from '../util/types';

const isMeetingAuthReq = (authReqs: AuthRequirement, isLoggedIn: boolean, userRole: UserRole) => {
  switch (authReqs) {
    case AuthRequirement.NONE:
      return true;
    case AuthRequirement.LOGGED_IN:
      return isLoggedIn;
    case AuthRequirement.LOGGED_OUT:
      return !isLoggedIn;
    case AuthRequirement.LOGGED_IN_AS_STUDENT:
      return isLoggedIn && gtEqStudent(userRole);
    case AuthRequirement.LOGGED_IN_AS_TEACHER:
      return isLoggedIn && gtEqTeacher(userRole);
    case AuthRequirement.LOGGED_IN_AS_ADMIN:
      return isLoggedIn && gtEqAdmin(userRole);
    default:
      // fail open for unhandled authReqs
      return true;
  }
};

export const withAuthRequirement = (authReq: AuthRequirement) =>
  function<P>(Component: React.ComponentType<P>): React.FC<P> {
    return (props) => {
      const [authState] = useAuth();
      const isLoggedIn = isLoggedInSelector(authState);
      const isAuthPending = authState.isPending;
      const userRole = authState.user.role;
      const navigate = useNavigate();
      const location = useLocation();

      let { returnToRoute } = useRouteInfo();
      returnToRoute = location.pathname === returnToRoute ? '/library' : returnToRoute;

      const meetsAuthReqs = isMeetingAuthReq(authReq, isLoggedIn, userRole);

      useEffect(() => {
        if (isAuthPending || meetsAuthReqs) {
          return;
        }
        // when the current session fails to meet auth
        // reqs, redirect the user to somewhere reasonable
        switch (authReq) {
          case AuthRequirement.NONE:
            break;
          case AuthRequirement.LOGGED_IN:
            notify.message.error({ content: 'must be logged in' });
            navigate('/login');
            break;
          case AuthRequirement.LOGGED_OUT:
            navigate(returnToRoute);
            break;
          case AuthRequirement.LOGGED_IN_AS_STUDENT:
            notify.message.error({ content: 'must be logged in as a student' });
            navigate(isLoggedIn ? returnToRoute : '/login');
            break;
          case AuthRequirement.LOGGED_IN_AS_TEACHER:
            notify.message.error({ content: 'must be logged in as a teacher' });
            navigate(isLoggedIn ? returnToRoute : '/login');
            break;
          case AuthRequirement.LOGGED_IN_AS_ADMIN:
            notify.message.error({ content: 'must be logged in as a admin' });
            navigate(isLoggedIn ? returnToRoute : '/login');
            break;
        }
      }, [isAuthPending, meetsAuthReqs, navigate, isLoggedIn, returnToRoute]);

      return meetsAuthReqs ? <Component {...props} /> : <Fallback />;
    };
  };
