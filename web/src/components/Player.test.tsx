import { render } from '@testing-library/react';
import React from 'react';
import { QualitySelectionStrategy } from '../lib/MediaPlayer';
import { Test } from '../testing';
import { Player } from './Player';

describe('Player', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <Test>
        <Player.Video playerOptions={{}} quality={{ type: 'strategy', strategy: QualitySelectionStrategy.Auto }} />
        <Player.Audio playerOptions={{}} quality={{ type: 'strategy', strategy: QualitySelectionStrategy.Auto }} />
      </Test>
    );
    expect(container).toBeInTheDocument();
  });
});
