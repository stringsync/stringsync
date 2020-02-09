import React from 'react';
import ConfirmEmail from './ConfirmEmail';
import { render } from '@testing-library/react';
import { getTestComponent } from '../../testing/';

it('renders without crashing', () => {
  const { TestComponent } = getTestComponent(ConfirmEmail, {});
  const { container } = render(<TestComponent />);
  expect(container).toBeInTheDocument();
});
