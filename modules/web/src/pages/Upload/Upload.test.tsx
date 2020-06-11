import React from 'react';
import { getTestComponent } from '../../testing';
import Upload from './Upload';
import { render } from '@testing-library/react';

it('renders without crashing', () => {
  const { TestComponent } = getTestComponent(Upload, {});
  const { container } = render(<TestComponent />);
  expect(container).toBeInTheDocument();
});
