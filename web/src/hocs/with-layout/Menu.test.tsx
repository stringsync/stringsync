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

  const { getByText } = render(<TestComponent />);
  expect(getByText('login')).toBeInTheDocument();
});
