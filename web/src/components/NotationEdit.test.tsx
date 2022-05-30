import { render } from '@testing-library/react';
import React from 'react';
import { Test } from '../testing';
import NotationEdit from './NotationEdit';

describe('NotationEdit', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <Test>
        <NotationEdit />
      </Test>
    );
    expect(container).toBeInTheDocument();
  });
});
