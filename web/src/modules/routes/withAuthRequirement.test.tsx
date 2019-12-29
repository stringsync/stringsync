import React from 'react';
import { AuthRequirements, withAuthRequirement } from './withAuthRequirement';
import { getTestComponent } from '../../testing';
import { render } from '@testing-library/react';
import { UserRoles } from '../../../../common/types';

const Dummy = () => <div data-testid="dummy" />;

it.each([
  { isLoggedIn: false, role: 'student' },
  { isLoggedIn: true, role: 'student' },
  { isLoggedIn: true, role: 'teacher' },
  { isLoggedIn: true, role: 'admin' },
])('renders the component when requirement is NONE', ({ isLoggedIn, role }) => {
  const { TestComponent } = getTestComponent(
    withAuthRequirement(AuthRequirements.NONE)(Dummy),
    {},
    { auth: { isLoggedIn, user: { role: role as UserRoles } } }
  );

  const { getByTestId } = render(<TestComponent />);
  expect(getByTestId('dummy')).toBeInTheDocument();
});

it('renders nothing when not logged in and requirement is LOGGED_IN', () => {
  const { TestComponent } = getTestComponent(
    withAuthRequirement(AuthRequirements.LOGGED_IN)(Dummy),
    {},
    { auth: { isLoggedIn: false } }
  );

  const { queryByTestId } = render(<TestComponent />);
  expect(queryByTestId('dummy')).toBeNull();
});
