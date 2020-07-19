import React from 'react';
import { render } from '@testing-library/react';
import { Test } from '../../testing';
import { ReqPasswordReset } from './ReqPasswordReset';

it('renders without crashing', () => {
  const { container } = render(
    <Test>
      <ReqPasswordReset />
    </Test>
  );
  expect(container).toBeInTheDocument();
});
