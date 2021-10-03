import { render } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Router } from 'react-router';
import { UserRole } from '../domain';
import { Test } from '../testing';
import { AuthRequirement } from '../util/types';
import { withAuthRequirement } from './withAuthRequirement';

describe.skip('withAuthRequirement', () => {
  const Dummy: React.FC = (props) => <div data-testid="dummy">{props.children}</div>;

  describe('with AuthRequirement.NONE', () => {
    let Component: React.FC;

    beforeEach(() => {
      Component = withAuthRequirement(AuthRequirement.NONE)(Dummy);
    });

    it('renders when logged out', () => {
      const { getByTestId } = render(
        <Test>
          <Component />
        </Test>
      );

      expect(getByTestId('dummy')).toBeInTheDocument();
    });

    it('renders when logged in', () => {
      const { getByTestId } = render(
        <Test>
          <Component />
        </Test>
      );

      expect(getByTestId('dummy')).toBeInTheDocument();
    });

    it('renders when pending', () => {
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
      const history = createMemoryHistory();

      const { getByTestId } = render(
        <Router history={history}>
          <Component />
        </Router>
      );

      expect(() => getByTestId('dummy')).toThrow();
    });

    it('renders when logged out', () => {
      const history = createMemoryHistory();

      const { getByTestId } = render(
        <Router history={history}>
          <Component />
        </Router>
      );

      expect(getByTestId('dummy')).toBeInTheDocument();
    });

    it('does render when pending', () => {
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

    it('renders when logged in', () => {
      const history = createMemoryHistory();

      const { getByTestId } = render(
        <Router history={history}>
          <Component />
        </Router>
      );

      expect(getByTestId('dummy')).toBeInTheDocument();
    });

    it('does not render when logged out', () => {
      const history = createMemoryHistory();

      const { getByTestId } = render(
        <Router history={history}>
          <Component />
        </Router>
      );

      expect(() => getByTestId('dummy')).toThrow();
    });

    it('does not render when pending', () => {
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
      'renders when logged in as student for greater',
      (role) => {
        const history = createMemoryHistory();

        const { getByTestId } = render(
          <Router history={history}>
            <Component />
          </Router>
        );

        expect(getByTestId('dummy')).toBeInTheDocument();
      }
    );

    it('does not render when logged out', () => {
      const history = createMemoryHistory();

      const { getByTestId } = render(
        <Router history={history}>
          <Component />
        </Router>
      );

      expect(() => getByTestId('dummy')).toThrow();
    });

    it('does not render when pending', () => {
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
      const history = createMemoryHistory();

      const { getByTestId } = render(
        <Router history={history}>
          <Component />
        </Router>
      );

      expect(getByTestId('dummy')).toBeInTheDocument();
    });

    it('does not render when logged in as less than teacher', () => {
      const history = createMemoryHistory();

      const { getByTestId } = render(
        <Router history={history}>
          <Component />
        </Router>
      );

      expect(() => getByTestId('dummy')).toThrow();
    });

    it('does not render when logged out', () => {
      const history = createMemoryHistory();

      const { getByTestId } = render(
        <Router history={history}>
          <Component />
        </Router>
      );

      expect(() => getByTestId('dummy')).toThrow();
    });

    it('does not render when pending', () => {
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
      const history = createMemoryHistory();

      const { getByTestId } = render(
        <Router history={history}>
          <Component />
        </Router>
      );

      expect(getByTestId('dummy')).toBeInTheDocument();
    });

    it.each([UserRole.STUDENT, UserRole.TEACHER])('does not render when logged in as less than admin', (role) => {
      const history = createMemoryHistory();

      const { getByTestId } = render(
        <Router history={history}>
          <Component />
        </Router>
      );

      expect(() => getByTestId('dummy')).toThrow();
    });

    it('does not render when logged out', () => {
      const history = createMemoryHistory();

      const { getByTestId } = render(
        <Router history={history}>
          <Component />
        </Router>
      );

      expect(() => getByTestId('dummy')).toThrow();
    });

    it('does not render when pending', () => {
      const { getByTestId } = render(
        <Test>
          <Component />
        </Test>
      );

      expect(() => getByTestId('dummy')).toThrow();
    });
  });
});
