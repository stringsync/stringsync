import React from 'react';
import { Menu } from './Menu';
import { getTestComponent } from '../../testing';
import { render } from '@testing-library/react';

it('shows a login button when logged out', () => {
  const { TestComponent } = getTestComponent(
    Menu,
    {},
    {
      auth: {
        isLoggedIn: false,
        isPending: false,
      },
    }
  );

  const { container, getByText } = render(<TestComponent />);

  expect(getByText('login')).toBeInTheDocument();
  expect(
    container.querySelectorAll<HTMLAnchorElement>('a[href="/login"]').length
  ).toBeGreaterThanOrEqual(1);
});

it('shows a signup button when logged out', () => {
  const { TestComponent } = getTestComponent(
    Menu,
    {},
    {
      auth: {
        isLoggedIn: false,
        isPending: false,
      },
    }
  );

  const { container, getByText } = render(<TestComponent />);

  expect(getByText('signup')).toBeInTheDocument();
  expect(
    container.querySelectorAll<HTMLAnchorElement>('a[href="/signup"]').length
  ).toBeGreaterThanOrEqual(1);
});
