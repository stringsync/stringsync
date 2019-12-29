import React from 'react';
import Signup from './Signup';
import { render } from '@testing-library/react';
import { getTestComponent } from '../../testing';

it('renders without crashing', () => {
  const { TestComponent } = getTestComponent(Signup, {});
  const { container } = render(<TestComponent />);
  expect(container).toBeInTheDocument();
});

it.each(['/library', '/login'])('has useful links', (href) => {
  const { TestComponent } = getTestComponent(Signup, {});
  const { container } = render(<TestComponent />);

  expect(
    container.querySelectorAll<HTMLAnchorElement>(`a[href="${href}"]`).length
  ).toBeGreaterThan(0);
});

it.each(['email', 'username', 'password'])(
  'has required fields',
  (placeholderText) => {
    const { TestComponent } = getTestComponent(Signup, {});
    const { getByPlaceholderText } = render(<TestComponent />);

    expect(getByPlaceholderText(placeholderText)).toBeInTheDocument();
  }
);
