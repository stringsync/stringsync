import { render } from '@testing-library/react';
import React from 'react';
import { Test } from '../../../testing';
import { NotationList } from './NotationList';

describe('NotationList', () => {
  it('renders without crashing', async () => {
    const { container } = render(
      <Test>
        <NotationList grid={{}} />
      </Test>
    );

    expect(container).toBeInTheDocument();
  });
});
