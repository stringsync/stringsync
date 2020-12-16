import { render } from '@testing-library/react';
import React from 'react';
import { Test } from '../../testing';
import { DefaultLayout } from './DefaultLayout';

describe('DefaultLayout', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <Test>
        <DefaultLayout />
      </Test>
    );
    expect(container).toBeInTheDocument();
  });
});
