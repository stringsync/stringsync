import { render } from '@testing-library/react';
import { NoopMediaPlayer } from '../lib/MediaPlayer';
import { NoopMusicDisplay } from '../lib/MusicDisplay/NoopMusicDisplay';
import { DisplayMode } from '../lib/musicxml';
import { FretMarkerDisplay, ScaleSelectionType } from '../lib/notations';
import { Test } from '../testing';
import { Fretboard } from './Fretboard';

describe('Fretboard', () => {
  it('renders without crashing', () => {
    const mediaPlayer = new NoopMediaPlayer();
    const musicDisplay = new NoopMusicDisplay();

    const { container } = render(
      <Test>
        <Fretboard
          mediaPlayer={mediaPlayer}
          musicDisplay={musicDisplay}
          settings={{
            defaultSidecarWidthPx: 500,
            defaultTheaterHeightPx: 500,
            displayMode: DisplayMode.NotesAndTabs,
            fretMarkerDisplay: FretMarkerDisplay.None,
            isAutoscrollPreferred: true,
            isFretboardVisible: true,
            isLoopActive: false,
            isVideoVisible: false,
            preferredLayout: 'sidecar',
            scaleSelectionType: ScaleSelectionType.None,
            selectedScale: null,
          }}
        />
      </Test>
    );
    expect(container).toBeInTheDocument();
  });
});
