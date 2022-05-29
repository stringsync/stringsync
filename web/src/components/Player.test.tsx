import { render } from '@testing-library/react';
import React from 'react';
import { Test } from '../testing';
import { Player } from './Player';

describe('Player', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <Test>
        <Player.Video playerOptions={{}} />
        <Player.Audio playerOptions={{}} />
      </Test>
    );
    expect(container).toBeInTheDocument();
  });
});
