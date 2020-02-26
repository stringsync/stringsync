import React from 'react';
import { Menu } from './Menu';
import { getTestComponent } from '../../testing';
import { render } from '@testing-library/react';
import { UserRoles } from '../../common/types';

it('shows login and signup when not logged in', () => {
  const { TestComponent } = getTestComponent(
    Menu,
    {},
    { auth: { isLoggedIn: false, isPending: false } }
  );

  const { container, getByText } = render(<TestComponent />);

  expect(getByText('login')).toBeInTheDocument();
  expect(getByText('signup')).toBeInTheDocument();
  expect(
    container.querySelectorAll<HTMLAnchorElement>('a[href="/login"]').length
  ).toBeGreaterThanOrEqual(1);
  expect(
    container.querySelectorAll<HTMLAnchorElement>('a[href="/signup"]').length
  ).toBeGreaterThanOrEqual(1);
});

it.each([
  { isLoggedIn: true, isPending: false },
  { isLoggedIn: false, isPending: true },
  { isLoggedIn: true, isPending: true },
])(
  'hides login and signup when logged in or auth pending',
  ({ isLoggedIn, isPending }) => {
    const { TestComponent } = getTestComponent(
      Menu,
      {},
      { auth: { isLoggedIn, isPending } }
    );

    const { container, queryAllByText } = render(<TestComponent />);

    expect(queryAllByText('login')).toHaveLength(0);
    expect(queryAllByText('signup')).toHaveLength(0);
    expect(
      container.querySelectorAll<HTMLAnchorElement>('a[href="/login"]')
    ).toHaveLength(0);
    expect(
      container.querySelectorAll<HTMLAnchorElement>('a[href="/signup"]')
    ).toHaveLength(0);
  }
);

it.each(['teacher', 'admin'] as UserRoles[])(
  'shows the upload button when gteq teacher and viewport is gteq lg',
  (role) => {
    const { TestComponent } = getTestComponent(
      Menu,
      {},
      {
        auth: {
          isLoggedIn: true,
          isPending: false,
          user: {
            role,
          },
        },
        viewport: {
          xs: false,
          sm: false,
          md: false,
          lg: true,
        },
      }
    );

    const { container } = render(<TestComponent />);

    expect(
      container.querySelectorAll<HTMLAnchorElement>('a[href="/upload"]').length
    ).toBeGreaterThanOrEqual(1);
  }
);
