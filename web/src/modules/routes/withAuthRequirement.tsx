import React from 'react';
import { useRouter } from './Router';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { message } from 'antd';
import compareRole from '../../util/compareRole';
import noop from '../../util/noop';

export enum AuthRequirements {
  NONE = 'NONE',
  LOGGED_IN = 'LOGGED_IN',
  LOGGED_OUT = 'LOGGED_OUT',
  LOGGED_IN_AS_STUDENT = 'LOGGED_IN_AS_STUDENT',
  LOGGED_IN_AS_TEACHER = 'LOGGED_IN_AS_TEACHER',
  LOGGED_IN_AS_ADMIN = 'LOGGED_IN_AS_ADMIN',
}

const ForceSuspense = React.lazy(() => new Promise(noop));

const withAuthRequirement = (authRequirements: AuthRequirements) =>
  function<P>(Component: React.ComponentType<P>): React.FC<P> {
    return (props) => {
      const router = useRouter();
      // TODO put real logic here
      const userRole = 'admin';
      const isLoggedIn = useSelector<RootState, boolean>(
        (state) => state.auth.isLoggedIn
      );
      const navigateTo = (path: string) => {
        window.requestAnimationFrame(() => {
          router.history.push(path);
        });
      };
      switch (authRequirements) {
        case AuthRequirements.NONE:
          break;
        case AuthRequirements.LOGGED_IN:
          if (!isLoggedIn) {
            message.error('must be logged in');
            navigateTo('login');
            return <ForceSuspense />;
          }
          break;
        case AuthRequirements.LOGGED_OUT:
          if (isLoggedIn) {
            navigateTo('library');
            return <ForceSuspense />;
          }
          break;
        case AuthRequirements.LOGGED_IN_AS_STUDENT:
          if (compareRole(userRole, 'student') < 0) {
            message.error('must be logged in as a student');
            if (isLoggedIn) {
              navigateTo('library');
            } else {
              navigateTo('login');
            }
            return <ForceSuspense />;
          }
          break;
        case AuthRequirements.LOGGED_IN_AS_TEACHER:
          if (compareRole(userRole, 'teacher') < 0) {
            message.error('must be logged in as a teacher');
            if (isLoggedIn) {
              navigateTo('library');
            } else {
              navigateTo('login');
            }
            return <ForceSuspense />;
          }
          break;
        case AuthRequirements.LOGGED_IN_AS_ADMIN:
          if (compareRole(userRole, 'admin') < 0) {
            message.error('must be logged in as a admin');
            if (isLoggedIn) {
              navigateTo('library');
            } else {
              navigateTo('login');
            }
            return <ForceSuspense />;
          }
          break;
      }
      return <Component {...props} />;
    };
  };

export default withAuthRequirement;
