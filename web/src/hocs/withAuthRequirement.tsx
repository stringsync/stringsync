import { message } from 'antd';
import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { gtEqAdmin, gtEqStudent, gtEqTeacher, UserRole } from '../domain';
import { isLoggedInSelector, RootState } from '../store';
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
      const isAuthPending = useSelector<RootState, boolean>((state) => state.auth.isPending);
      const isLoggedIn = useSelector<RootState, boolean>(isLoggedInSelector);
      const userRole = useSelector<RootState, UserRole>((state) => state.auth.user.role);
      const returnToRoute = useSelector<RootState, string>((state) => state.history.returnToRoute);
      const history = useHistory();
      const meetsAuthReqs = useRef(false);

      if (!isAuthPending) {
        meetsAuthReqs.current = isMeetingAuthReqs(authReqs, isLoggedIn, userRole);
      }

      useEffect(() => {
        if (isAuthPending || meetsAuthReqs.current) {
          return;
        }
        // when the current session fails to meet auth
        // reqs, redirect the user to somewhere reasonable
        switch (authReqs) {
          case AuthRequirement.NONE:
            break;
          case AuthRequirement.LOGGED_IN:
            message.error('must be logged in');
            history.push('login');
            break;
          case AuthRequirement.LOGGED_OUT:
            history.push(returnToRoute);
            break;
          case AuthRequirement.LOGGED_IN_AS_STUDENT:
            message.error('must be logged in as a student');
            history.push(isLoggedIn ? returnToRoute : 'login');
            break;
          case AuthRequirement.LOGGED_IN_AS_TEACHER:
            message.error('must be logged in as a teacher');
            history.push(isLoggedIn ? returnToRoute : 'login');
            break;
          case AuthRequirement.LOGGED_IN_AS_ADMIN:
            message.error('must be logged in as a admin');
            history.push(isLoggedIn ? returnToRoute : 'login');
            break;
        }
      }, [history, isAuthPending, isLoggedIn, meetsAuthReqs, returnToRoute]);

      return meetsAuthReqs.current ? <Component {...props} /> : null;
    };
  };
