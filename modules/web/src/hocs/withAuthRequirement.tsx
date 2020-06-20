import React, { useEffect, useRef } from 'react';
import { message } from 'antd';
import { UserRole, gtEqStudent, gtEqTeacher, gtEqAdmin } from '@stringsync/domain';
import { useHistory } from 'react-router';
import { useSelector } from 'react-redux';
import { RootState, isLoggedInSelector } from '../store';
import { AuthRequirement } from '@stringsync/common';

export const withAuthRequirement = (authReqs: AuthRequirement) =>
  function<P>(Component: React.ComponentType<P>): React.FC<P> {
    return (props) => {
      const isAuthPending = useSelector<RootState, boolean>((state) => state.auth.isPending);
      const isLoggedIn = useSelector<RootState, boolean>(isLoggedInSelector);
      const userRole = useSelector<RootState, UserRole>((state) => state.auth.user.role);
      const returnToRoute = useSelector<RootState, string>((state) => state.history.returnToRoute);

      const meetsAuthReqs = useRef(true);
      const history = useHistory();

      switch (authReqs) {
        case AuthRequirement.NONE:
          meetsAuthReqs.current = true;
          break;
        case AuthRequirement.LOGGED_IN:
          meetsAuthReqs.current = isLoggedIn;
          break;
        case AuthRequirement.LOGGED_OUT:
          meetsAuthReqs.current = !isLoggedIn;
          break;
        case AuthRequirement.LOGGED_IN_AS_STUDENT:
          meetsAuthReqs.current = isLoggedIn && gtEqStudent(userRole);
          break;
        case AuthRequirement.LOGGED_IN_AS_TEACHER:
          meetsAuthReqs.current = isLoggedIn && gtEqTeacher(userRole);
          break;
        case AuthRequirement.LOGGED_IN_AS_ADMIN:
          meetsAuthReqs.current = isLoggedIn && gtEqAdmin(userRole);
          break;
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
            history.push(isLoggedIn ? 'library' : 'login');
            break;
          case AuthRequirement.LOGGED_IN_AS_TEACHER:
            message.error('must be logged in as a teacher');
            history.push(isLoggedIn ? 'library' : 'login');
            break;
          case AuthRequirement.LOGGED_IN_AS_ADMIN:
            message.error('must be logged in as a admin');
            history.push(isLoggedIn ? 'library' : 'login');
            break;
        }
      }, [history, isAuthPending, isLoggedIn, meetsAuthReqs, returnToRoute]);

      return meetsAuthReqs.current ? <Component {...props} /> : null;
    };
  };
