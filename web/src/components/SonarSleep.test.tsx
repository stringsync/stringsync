import { render } from '@testing-library/react';
import React from 'react';
import { Test } from '../testing';
import { SonarSleep } from './SonarSleep';

describe('SonarSleep', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <Test>
        <SonarSleep />
      </Test>
    );
    expect(container).toBeInTheDocument();
  });
});
