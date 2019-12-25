import React, { useCallback } from 'react';
import { useRouter } from '../root/Router';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { message } from 'antd';
import { compareRole, noop } from '../../util';
import { UserRoles } from 'common/types';

export enum AuthRequirements {
  NONE,
  LOGGED_IN,
  LOGGED_OUT,
  LOGGED_IN_AS_STUDENT,
  LOGGED_IN_AS_TEACHER,
  LOGGED_IN_AS_ADMIN,
}

interface SelectedState {
  isLoggedIn: boolean;
  userRole: UserRoles;
}

const ForceSuspense = React.lazy(() => new Promise(noop));

const withAuthRequirement = (authRequirements: AuthRequirements) =>
  function<P>(Component: React.ComponentType<P>): React.FC<P> {
    return (props) => {
      const router = useRouter();

      const { isLoggedIn, userRole } = useSelector<RootState, SelectedState>(
        (state) => ({
          isLoggedIn: state.auth.isLoggedIn,
          userRole: state.auth.user.role,
        })
      );

      const navigateTo = useCallback(
        (path: string) => {
          router.history.push(path);
        },
        [router]
      );

      switch (authRequirements) {
        case AuthRequirements.NONE:
          break;
        case AuthRequirements.LOGGED_IN:
          message.error('must be logged in');
          if (!isLoggedIn) {
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
            navigateTo(isLoggedIn ? 'library' : 'login');
            return <ForceSuspense />;
          }
          break;
        case AuthRequirements.LOGGED_IN_AS_TEACHER:
          if (compareRole(userRole, 'teacher') < 0) {
            message.error('must be logged in as a teacher');
            navigateTo(isLoggedIn ? 'library' : 'login');
            return <ForceSuspense />;
          }
          break;
        case AuthRequirements.LOGGED_IN_AS_ADMIN:
          if (compareRole(userRole, 'admin') < 0) {
            message.error('must be logged in as a admin');
            navigateTo(isLoggedIn ? 'library' : 'login');
            return <ForceSuspense />;
          }
          break;
      }
      return <Component {...props} />;
    };
  };

export default withAuthRequirement;
