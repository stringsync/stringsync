import { render } from '@testing-library/react';
import React from 'react';
import { NoopMediaPlayer, QualitySelectionStrategy } from '../lib/MediaPlayer';
import { NoopMusicDisplay } from '../lib/MusicDisplay/NoopMusicDisplay';
import { DisplayMode } from '../lib/musicxml';
import { FretMarkerDisplay, ScaleSelectionType } from '../lib/notations';
import { Test } from '../testing';
import { NotationPlayerControls } from './NotationPlayerControls';

describe('Controls', () => {
  it('renders without crashing', () => {
    const musicDisplay = new NoopMusicDisplay();
    const mediaPlayer = new NoopMediaPlayer();
    const setSettings = jest.fn();

    const { container } = render(
      <Test>
        <NotationPlayerControls
          videoControls
          notation={null}
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
            quality: { type: 'strategy', strategy: QualitySelectionStrategy.Auto },
          }}
          setSettings={setSettings}
        />
      </Test>
    );
    expect(container).toBeInTheDocument();
  });
});
