import { render } from '@testing-library/react';
import React from 'react';
import { NoopMediaPlayer } from '../lib/MediaPlayer';
import { NoopMusicDisplay } from '../lib/MusicDisplay/NoopMusicDisplay';
import { Test } from '../testing';
import { Seekbar } from './Seekbar';

describe('Seekbar', () => {
  it('renders without crashing', () => {
    const mediaPlayer = new NoopMediaPlayer();
    const musicDisplay = new NoopMusicDisplay();

    const { container } = render(
      <Test>
        <Seekbar mediaPlayer={mediaPlayer} musicDisplay={musicDisplay} notation={null} />
      </Test>
    );
    expect(container).toBeInTheDocument();
  });
});
