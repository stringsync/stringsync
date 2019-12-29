import React from 'react';
import { useStoreState } from './useStoreState';
import { getTestComponent } from '../testing';
import { render } from '@testing-library/react';

it('gets the selected store state', () => {
  const Component = () => {
    const username = useStoreState((state) => state.auth.user.username);
    return <div>{username}</div>;
  };
  const { TestComponent } = getTestComponent(
    Component,
    {},
    { auth: { user: { username: 'username' } } }
  );

  const { getByText } = render(<TestComponent />);

  expect(getByText('username')).toBeInTheDocument();
});
