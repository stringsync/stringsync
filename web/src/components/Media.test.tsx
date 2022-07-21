import { render } from '@testing-library/react';
import React from 'react';
import { Test } from '../testing';
import { Media } from './Media';

describe('Media', () => {
  it('renders without crashing', () => {
    const onPlayerChange = jest.fn();

    const { container } = render(
      <Test>
        <Media src={null} video={false} onPlayerChange={onPlayerChange} />
      </Test>
    );
    expect(container).toBeInTheDocument();
  });
});
