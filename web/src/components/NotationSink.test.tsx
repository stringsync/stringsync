import { render } from '@testing-library/react';
import React from 'react';
import { NoopMediaPlayer } from '../lib/MediaPlayer';
import { NoopMusicDisplay } from '../lib/MusicDisplay/NoopMusicDisplay';
import { DisplayMode } from '../lib/musicxml';
import { FretMarkerDisplay, ScaleSelectionType } from '../lib/notations';
import { Test } from '../testing';
import { NotationSink } from './NotationSink';

describe('NotationSink', () => {
  it('renders without crashing', () => {
    const mediaPlayer = new NoopMediaPlayer();
    const musicDisplay = new NoopMusicDisplay();
    const setSettings = jest.fn();

    const { container } = render(
      <Test>
        <NotationSink
          mediaPlayer={mediaPlayer}
          musicDisplay={musicDisplay}
          notationSettings={{
            defaultSidecarWidthPx: 100,
            defaultTheaterHeightPx: 100,
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
          setNotationSettings={setSettings}
        />
      </Test>
    );
    expect(container).toBeInTheDocument();
  });
});
