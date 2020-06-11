import React from 'react';
import { withAuthRequirement } from './withAuthRequirement';
import { getTestComponent } from '../testing';
import { render } from '@testing-library/react';
import { UserRole } from '@stringsync/domain';
import { AuthRequirement } from '@stringsync/common';

const Dummy = () => <div data-testid="dummy" />;

it.each([
  { isLoggedIn: false, role: UserRole.STUDENT },
  { isLoggedIn: true, role: UserRole.STUDENT },
  { isLoggedIn: true, role: UserRole.TEACHER },
  { isLoggedIn: true, role: UserRole.ADMIN },
])('renders the component when requirement is NONE', ({ isLoggedIn, role }) => {
  const { TestComponent } = getTestComponent(
    withAuthRequirement(AuthRequirement.NONE)(Dummy),
    {},
    { auth: { isLoggedIn, user: { role } } }
  );

  const { getByTestId } = render(<TestComponent />);
  expect(getByTestId('dummy')).toBeInTheDocument();
});

it('renders nothing when not logged in and requirement is LOGGED_IN', () => {
  const { TestComponent } = getTestComponent(
    withAuthRequirement(AuthRequirement.LOGGED_IN)(Dummy),
    {},
    { auth: { isLoggedIn: false } }
  );

  const { queryByTestId } = render(<TestComponent />);
  expect(queryByTestId('dummy')).toBeNull();
});
