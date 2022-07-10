import { render } from '@testing-library/react';
import React from 'react';
import { Test } from '../testing';
import { SuggestedNotations } from './SuggestedNotations';

describe('SuggestedNotations', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <Test>
        <SuggestedNotations srcNotationId="abc" />
      </Test>
    );
    expect(container).toBeInTheDocument();
  });
});
