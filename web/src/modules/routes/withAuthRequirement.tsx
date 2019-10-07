import React from 'react';
import { useRouter } from './Router';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { message } from 'antd';
import compareRole from '../../util/compareRole';

export enum AuthRequirements {
  NONE = 'NONE',
  LOGGED_IN = 'LOGGED_IN',
  LOGGED_OUT = 'LOGGED_OUT',
  LOGGED_IN_AS_STUDENT = 'LOGGED_IN_AS_STUDENT',
  LOGGED_IN_AS_TEACHER = 'LOGGED_IN_AS_TEACHER',
  LOGGED_IN_AS_ADMIN = 'LOGGED_IN_AS_ADMIN',
}

const withAuthRequirement = (authRequirements: AuthRequirements) =>
  function<P>(Component: React.ComponentType<P>): React.FC<P> {
    return (props) => {
      const router = useRouter();
      // TODO put real logic here
      const userRole = 'student';
      const isLoggedIn = useSelector<RootState, boolean>(
        (state) => state.auth.isLoggedIn
      );
      const username = useSelector<RootState, string>(
        (state) => state.auth.user.username
      );
      switch (authRequirements) {
        case AuthRequirements.NONE:
          break;
        case AuthRequirements.LOGGED_IN:
          if (!isLoggedIn) {
            message.error('must be logged in');
            router.history.push('login');
          }
          break;
        case AuthRequirements.LOGGED_OUT:
          if (isLoggedIn) {
            message.info(`already logged in as @${username}`);
            router.history.goBack();
          }
          break;
        case AuthRequirements.LOGGED_IN_AS_STUDENT:
          if (compareRole(userRole, 'student') < 0) {
            message.error('must be logged in as a student');
            if (isLoggedIn) {
              router.history.goBack();
            } else {
              router.history.push('login');
            }
          }
          break;
        case AuthRequirements.LOGGED_IN_AS_TEACHER:
          if (compareRole(userRole, 'teacher') < 0) {
            message.error('must be logged in as a teacher');
            if (isLoggedIn) {
              router.history.goBack();
            } else {
              router.history.push('login');
            }
          }
          break;
        case AuthRequirements.LOGGED_IN_AS_ADMIN:
          if (compareRole(userRole, 'admin') < 0) {
            message.error('must be logged in as a admin');
            if (isLoggedIn) {
              router.history.goBack();
            } else {
              router.history.push('login');
            }
          }
          break;
      }
      return <Component {...props} />;
    };
  };

export default withAuthRequirement;
