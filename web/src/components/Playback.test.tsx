import { render } from '@testing-library/react';
import React from 'react';
import { NoopMediaPlayer } from '../lib/MediaPlayer';
import { Test } from '../testing';
import { Playback } from './Playback';

describe('Playback', () => {
  it('renders without crashing', () => {
    const mediaPlayer = new NoopMediaPlayer();

    const { container } = render(
      <Test>
        <Playback mediaPlayer={mediaPlayer} />
      </Test>
    );
    expect(container).toBeInTheDocument();
  });
});
