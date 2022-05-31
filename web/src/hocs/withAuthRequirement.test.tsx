import { render } from '@testing-library/react';
import React, { PropsWithChildren } from 'react';
import { AuthState } from '../ctx/auth';
import { getNullAuthUser } from '../ctx/auth/getNullAuthUser';
import { useAuth } from '../ctx/auth/useAuth';
import { UserRole } from '../lib/graphql';
import { Test } from '../testing';
import * as rand from '../util/rand';
import { AuthRequirement } from '../util/types';
import { withAuthRequirement } from './withAuthRequirement';

jest.mock('../ctx/auth/useAuth', () => {
  const originalModule = jest.requireActual('../ctx/auth/useAuth');
  return {
    __esModule: true,
    ...originalModule,
    useAuth: jest.fn(),
  };
});
const getDefaultAuthState = (): AuthState => ({
  isPending: true,
  errors: [],
  user: getNullAuthUser(),
});
const setAuthState = (authState: Partial<AuthState>) => {
  (useAuth as jest.Mock).mockReturnValue([{ ...getDefaultAuthState(), ...authState }, {}]);
};
const simulatePending = () => {
  setAuthState(getDefaultAuthState());
};
const simulateLogout = () => {
  setAuthState({ isPending: false });
};
const simulateLoginAs = (role: UserRole) => {
  setAuthState({
    isPending: false,
    errors: [],
    user: {
      id: rand.str(8),
      role,
      confirmedAt: new Date().toString(),
      email: 'foo@gmail.com',
      username: 'foo',
    },
  });
};

describe('withAuthRequirement', () => {
  const Dummy: React.FC<PropsWithChildren<{}>> = (props) => <div data-testid="dummy">{props.children}</div>;

  beforeEach(() => {
    setAuthState(getDefaultAuthState());
  });

  describe('with AuthRequirement.NONE', () => {
    let Component: React.FC;

    beforeEach(() => {
      Component = withAuthRequirement(AuthRequirement.NONE)(Dummy);
    });

    it('renders when logged out', () => {
      simulateLogout();
      const { getByTestId } = render(
        <Test>
          <Component />
        </Test>
      );

      expect(getByTestId('dummy')).toBeInTheDocument();
    });

    it.each([UserRole.STUDENT, UserRole.TEACHER, UserRole.ADMIN])('renders when logged in as %s', (role) => {
      simulateLoginAs(role);
      const { getByTestId } = render(
        <Test>
          <Component />
        </Test>
      );

      expect(getByTestId('dummy')).toBeInTheDocument();
    });

    it('renders when pending', () => {
      simulatePending();
      const { getByTestId } = render(
        <Test>
          <Component />
        </Test>
      );

      expect(getByTestId('dummy')).toBeInTheDocument();
    });
  });

  describe('with AuthRequirement.LOGGED_OUT', () => {
    let Component: React.FC;

    beforeEach(() => {
      Component = withAuthRequirement(AuthRequirement.LOGGED_OUT)(Dummy);
    });

    it('does not render when logged in', () => {
      simulateLoginAs(UserRole.STUDENT);
      const { getByTestId } = render(
        <Test>
          <Component />
        </Test>
      );

      expect(() => getByTestId('dummy')).toThrow();
    });

    it('renders when logged out', () => {
      simulateLogout();
      const { getByTestId } = render(
        <Test>
          <Component />
        </Test>
      );

      expect(getByTestId('dummy')).toBeInTheDocument();
    });

    it('renders when pending', () => {
      simulatePending();
      const { getByTestId } = render(
        <Test>
          <Component />
        </Test>
      );

      expect(getByTestId('dummy')).toBeInTheDocument();
    });
  });

  describe('with AuthRequirement.LOGGED_IN', () => {
    let Component: React.FC;

    beforeEach(() => {
      Component = withAuthRequirement(AuthRequirement.LOGGED_IN)(Dummy);
    });

    it.each([UserRole.STUDENT, UserRole.TEACHER, UserRole.ADMIN])('renders when logged in as %s', (role) => {
      simulateLoginAs(role);
      const { getByTestId } = render(
        <Test>
          <Component />
        </Test>
      );

      expect(getByTestId('dummy')).toBeInTheDocument();
    });

    it('does not render when logged out', () => {
      simulateLogout();
      const { getByTestId } = render(
        <Test>
          <Component />
        </Test>
      );

      expect(() => getByTestId('dummy')).toThrow();
    });

    it('does not render when pending', () => {
      simulatePending();
      const { getByTestId } = render(
        <Test>
          <Component />
        </Test>
      );

      expect(() => getByTestId('dummy')).toThrow();
    });
  });

  describe('with AuthRequirement.LOGGED_IN_AS_STUDENT', () => {
    let Component: React.FC;

    beforeEach(() => {
      Component = withAuthRequirement(AuthRequirement.LOGGED_IN_AS_STUDENT)(Dummy);
    });

    it.each([UserRole.STUDENT, UserRole.TEACHER, UserRole.ADMIN])(
      'renders when logged in as student or greater',
      (role) => {
        simulateLoginAs(role);
        const { getByTestId } = render(
          <Test>
            <Component />
          </Test>
        );

        expect(getByTestId('dummy')).toBeInTheDocument();
      }
    );

    it('does not render when logged out', () => {
      simulateLogout();
      const { getByTestId } = render(
        <Test>
          <Component />
        </Test>
      );

      expect(() => getByTestId('dummy')).toThrow();
    });

    it('does not render when pending', () => {
      simulatePending();
      const { getByTestId } = render(
        <Test>
          <Component />
        </Test>
      );

      expect(() => getByTestId('dummy')).toThrow();
    });
  });

  describe('with AuthRequirement.LOGGED_IN_AS_TEACHER', () => {
    let Component: React.FC;

    beforeEach(() => {
      Component = withAuthRequirement(AuthRequirement.LOGGED_IN_AS_TEACHER)(Dummy);
    });

    it.each([UserRole.TEACHER, UserRole.ADMIN])('renders when logged in as teacher or greater', (role) => {
      simulateLoginAs(role);
      const { getByTestId } = render(
        <Test>
          <Component />
        </Test>
      );

      expect(getByTestId('dummy')).toBeInTheDocument();
    });

    it('does not render when logged in as less than teacher', () => {
      simulateLoginAs(UserRole.STUDENT);
      const { getByTestId } = render(
        <Test>
          <Component />
        </Test>
      );

      expect(() => getByTestId('dummy')).toThrow();
    });

    it('does not render when logged out', () => {
      simulateLogout();
      const { getByTestId } = render(
        <Test>
          <Component />
        </Test>
      );

      expect(() => getByTestId('dummy')).toThrow();
    });

    it('does not render when pending', () => {
      simulatePending();
      const { getByTestId } = render(
        <Test>
          <Component />
        </Test>
      );

      expect(() => getByTestId('dummy')).toThrow();
    });
  });

  describe('with AuthRequirement.LOGGED_IN_AS_ADMIN', () => {
    let Component: React.FC;

    beforeEach(() => {
      Component = withAuthRequirement(AuthRequirement.LOGGED_IN_AS_ADMIN)(Dummy);
    });

    it('renders when logged in as admin or greater', () => {
      simulateLoginAs(UserRole.ADMIN);
      const { getByTestId } = render(
        <Test>
          <Component />
        </Test>
      );

      expect(getByTestId('dummy')).toBeInTheDocument();
    });

    it.each([UserRole.STUDENT, UserRole.TEACHER])('does not render when logged in as less than admin', (role) => {
      simulateLoginAs(role);
      const { getByTestId } = render(
        <Test>
          <Component />
        </Test>
      );

      expect(() => getByTestId('dummy')).toThrow();
    });

    it('does not render when logged out', () => {
      simulateLogout();
      const { getByTestId } = render(
        <Test>
          <Component />
        </Test>
      );

      expect(() => getByTestId('dummy')).toThrow();
    });

    it('does not render when pending', () => {
      simulatePending();
      const { getByTestId } = render(
        <Test>
          <Component />
        </Test>
      );

      expect(() => getByTestId('dummy')).toThrow();
    });
  });
});
