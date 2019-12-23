import React from 'react';
import Login from './Login';
import { render } from '@testing-library/react';
import { getTestComponent } from '../../testing';

it('renders without crashing', () => {
  const { TestComponent } = getTestComponent(Login, {});
  const { container } = render(<TestComponent />);
  expect(container).toBeInTheDocument();
});

it('has at least one link to /library', () => {
  const { TestComponent } = getTestComponent(Login, {});
  const { container } = render(<TestComponent />);

  expect(
    container.querySelectorAll<HTMLAnchorElement>('a[href="/library"]').length
  ).toBeGreaterThan(0);
});

it('has at least one link to /signup', () => {
  const { TestComponent } = getTestComponent(Login, {});
  const { container } = render(<TestComponent />);

  expect(
    container.querySelectorAll<HTMLAnchorElement>('a[href="/signup"]').length
  ).toBeGreaterThan(0);
});
