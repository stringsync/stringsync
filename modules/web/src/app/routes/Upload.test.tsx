import React from 'react';
import Upload from './Upload';
import { render } from '@testing-library/react';

it('renders without crashing', () => {
  const { container } = render(<Upload />);
  expect(container).toBeInTheDocument();
});
