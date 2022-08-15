import { render } from '@testing-library/react';
import { noop } from 'lodash';
import React from 'react';
import { NotationSettings } from '../hooks/useNotationSettings';
import { QualitySelectionStrategy } from '../lib/MediaPlayer';
import { DisplayMode } from '../lib/musicxml';
import { FretMarkerDisplay, ScaleSelectionType } from '../lib/notations';
import { Test } from '../testing';
import { NotationPlayer } from './NotationPlayer';

describe('NotationPlayer', () => {
  it('renders without crashing', () => {
    const notationSettings: NotationSettings = {
      defaultSidecarWidthPx: 100,
      defaultTheaterHeightPx: 100,
      displayMode: DisplayMode.TabsOnly,
      fretMarkerDisplay: FretMarkerDisplay.None,
      isAutoscrollPreferred: true,
      isVideoVisible: true,
      scaleSelectionType: ScaleSelectionType.None,
      selectedScale: null,
      isLoopActive: false,
      isFretboardVisible: true,
      preferredLayout: 'sidecar',
      quality: { type: 'strategy', strategy: QualitySelectionStrategy.Auto },
    };

    const { container } = render(
      <Test>
        <NotationPlayer notation={null} notationSettings={notationSettings} setNotationSettings={noop} />
      </Test>
    );
    expect(container).toBeInTheDocument();
  });
});
