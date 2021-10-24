import { message } from 'antd';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router';
import { Fallback } from '../components/Fallback';
import { isLoggedInSelector, useAuth } from '../ctx/auth';
import { useRouteInfo } from '../ctx/route-info';
import { gtEqAdmin, gtEqStudent, gtEqTeacher } from '../domain';
import { UserRole } from '../graphql';
import { AuthRequirement } from '../util/types';

const isMeetingAuthReqs = (authReqs: AuthRequirement, isLoggedIn: boolean, userRole: UserRole) => {
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

export const withAuthRequirement = (authReqs: AuthRequirement) =>
  function<P>(Component: React.ComponentType<P>): React.FC<P> {
    return (props) => {
      const [authState] = useAuth();
      const isLoggedIn = isLoggedInSelector(authState);
      const isAuthPending = authState.isPending;
      const userRole = authState.user.role;
      const history = useHistory();

      let { returnToRoute } = useRouteInfo();
      returnToRoute = history.location.pathname === returnToRoute ? '/library' : returnToRoute;

      const meetsAuthReqs = isMeetingAuthReqs(authReqs, isLoggedIn, userRole);

      useEffect(() => {
        if (isAuthPending || meetsAuthReqs) {
          return;
        }
        // when the current session fails to meet auth
        // reqs, redirect the user to somewhere reasonable
        switch (authReqs) {
          case AuthRequirement.NONE:
            break;
          case AuthRequirement.LOGGED_IN:
            message.error('must be logged in');
            history.push('/login');
            break;
          case AuthRequirement.LOGGED_OUT:
            history.push(returnToRoute);
            break;
          case AuthRequirement.LOGGED_IN_AS_STUDENT:
            message.error('must be logged in as a student');
            history.push(isLoggedIn ? returnToRoute : '/login');
            break;
          case AuthRequirement.LOGGED_IN_AS_TEACHER:
            message.error('must be logged in as a teacher');
            history.push(isLoggedIn ? returnToRoute : '/login');
            break;
          case AuthRequirement.LOGGED_IN_AS_ADMIN:
            message.error('must be logged in as a admin');
            history.push(isLoggedIn ? returnToRoute : '/login');
            break;
        }
      }, [history, isAuthPending, isLoggedIn, meetsAuthReqs, returnToRoute]);

      return meetsAuthReqs ? <Component {...props} /> : <Fallback />;
    };
  };
