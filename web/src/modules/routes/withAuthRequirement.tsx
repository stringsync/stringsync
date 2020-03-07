import React, { useEffect, useRef, useCallback } from 'react';
import { message } from 'antd';
import { compareUserRoles } from '../../common';
import { useHistory } from 'react-router';
import { useSelector } from '../../hooks';

export enum AuthRequirements {
  NONE,
  LOGGED_IN,
  LOGGED_OUT,
  LOGGED_IN_AS_STUDENT,
  LOGGED_IN_AS_TEACHER,
  LOGGED_IN_AS_ADMIN,
}

export const withAuthRequirement = (authReqs: AuthRequirements) =>
  function<P>(Component: React.ComponentType<P>): React.FC<P> {
    return (props) => {
      const isAuthPending = useSelector((state) => state.auth.isPending);
      const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
      const userRole = useSelector((state) => state.auth.user.role);
      const returnToRoute = useSelector((state) => state.history.returnToRoute);
      const meetsAuthReqs = useRef(true);
      const history = useHistory();
      const navigateTo = useCallback(
        (path: string) => {
          history.push(path);
        },
        [history]
      );

      switch (authReqs) {
        case AuthRequirements.NONE:
          meetsAuthReqs.current = true;
          break;
        case AuthRequirements.LOGGED_IN:
          meetsAuthReqs.current = isLoggedIn;
          break;
        case AuthRequirements.LOGGED_OUT:
          meetsAuthReqs.current = !isLoggedIn;
          break;
        case AuthRequirements.LOGGED_IN_AS_STUDENT:
          meetsAuthReqs.current =
            isLoggedIn && compareUserRoles(userRole, 'student') >= 0;
          break;
        case AuthRequirements.LOGGED_IN_AS_TEACHER:
          meetsAuthReqs.current =
            isLoggedIn && compareUserRoles(userRole, 'teacher') >= 0;
          break;
        case AuthRequirements.LOGGED_IN_AS_ADMIN:
          meetsAuthReqs.current =
            isLoggedIn && compareUserRoles(userRole, 'admin') >= 0;
          break;
      }

      useEffect(() => {
        if (isAuthPending || meetsAuthReqs.current) {
          return;
        }
        // when the current session fails to meet auth
        // reqs, redirect the user to somewhere reasonable
        switch (authReqs) {
          case AuthRequirements.NONE:
            break;
          case AuthRequirements.LOGGED_IN:
            message.error('must be logged in');
            navigateTo('login');
            break;
          case AuthRequirements.LOGGED_OUT:
            navigateTo(returnToRoute);
            break;
          case AuthRequirements.LOGGED_IN_AS_STUDENT:
            message.error('must be logged in as a student');
            navigateTo(isLoggedIn ? 'library' : 'login');
            break;
          case AuthRequirements.LOGGED_IN_AS_TEACHER:
            message.error('must be logged in as a teacher');
            navigateTo(isLoggedIn ? 'library' : 'login');
            break;
          case AuthRequirements.LOGGED_IN_AS_ADMIN:
            message.error('must be logged in as a admin');
            navigateTo(isLoggedIn ? 'library' : 'login');
            break;
        }
      }, [
        history,
        isAuthPending,
        isLoggedIn,
        meetsAuthReqs,
        navigateTo,
        returnToRoute,
      ]);

      return meetsAuthReqs.current ? <Component {...props} /> : null;
    };
  };
