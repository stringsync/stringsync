import React from 'react';
import Upload from './Upload';
import { render } from '@testing-library/react';
import { Test } from '../../testing';

it('renders without crashing', () => {
  const { container } = render(
    <Test>
      <Upload />
    </Test>
  );
  expect(container).toBeInTheDocument();
});
