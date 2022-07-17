import { render } from '@testing-library/react';
import React from 'react';
import { Test } from '../testing';
import { Errors } from './Errors';

describe('Errors', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <Test>
        <Errors errors={['foo']} />
      </Test>
    );
    expect(container).toBeInTheDocument();
  });
});
