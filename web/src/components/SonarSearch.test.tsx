import { render } from '@testing-library/react';
import React from 'react';
import { Test } from '../testing';
import { SonarSearch } from './SonarSearch';

describe('SonarSearch', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <Test>
        <SonarSearch />
      </Test>
    );
    expect(container).toBeInTheDocument();
  });
});
