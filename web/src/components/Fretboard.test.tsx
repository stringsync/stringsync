import { render } from '@testing-library/react';
import { NoopMediaPlayer } from '../lib/MediaPlayer';
import { NoopMusicDisplay } from '../lib/MusicDisplay/NoopMusicDisplay';
import { Test } from '../testing';
import { Fretboard } from './Fretboard';

describe('Fretboard', () => {
  it('renders without crashing', () => {
    const mediaPlayer = new NoopMediaPlayer();
    const musicDisplay = new NoopMusicDisplay();

    const { container } = render(
      <Test>
        <Fretboard mediaPlayer={mediaPlayer} musicDisplay={musicDisplay} />
      </Test>
    );
    expect(container).toBeInTheDocument();
  });
});
