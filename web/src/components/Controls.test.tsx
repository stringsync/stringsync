import { render } from '@testing-library/react';
import React from 'react';
import { NoopMediaPlayer } from '../lib/MediaPlayer';
import { NoopMusicDisplay } from '../lib/MusicDisplay/NoopMusicDisplay';
import { DisplayMode } from '../lib/musicxml';
import { FretMarkerDisplay, ScaleSelectionType } from '../lib/notations';
import { Test } from '../testing';
import { Controls } from './Controls';

describe('Controls', () => {
  it('renders without crashing', () => {
    const settingsContainerRef = {} as any;
    const musicDisplay = new NoopMusicDisplay();
    const mediaPlayer = new NoopMediaPlayer();
    const setSettings = jest.fn();

    const { container } = render(
      <Test>
        <Controls
          showDetail
          videoControls
          notation={null}
          settingsContainerRef={settingsContainerRef}
          musicDisplay={musicDisplay}
          mediaPlayer={mediaPlayer}
          settings={{
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
          setSettings={setSettings}
        />
      </Test>
    );
    expect(container).toBeInTheDocument();
  });
});
