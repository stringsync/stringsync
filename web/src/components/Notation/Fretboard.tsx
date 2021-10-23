import { useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { MediaPlayer } from '../../lib/MediaPlayer';
import { MusicDisplay } from '../../lib/MusicDisplay';
import {
  FretboardJs,
  FretboardJsOptions,
  FretboardJsProps,
  MergeStrategy,
  PositionFilterParams,
  PositionStyle,
} from '../FretboardJs';
import { useMeasurePositions } from './hooks/useMeasurePositions';
import { useMusicDisplayCursorSnapshot } from './hooks/useMusicDisplayCursorSnapshot';
import { usePressedPositions } from './hooks/usePressedPositions';
import { useTonic } from './hooks/useTonic';
import { FretMarkerDisplay, NotationSettings, ScaleSelectionType } from './types';

const Outer = styled.div`
  z-index: 3;
`;

type Props = FretboardJsProps & {
  settings: NotationSettings;
  musicDisplay: MusicDisplay;
  mediaPlayer: MediaPlayer;
};

export const Fretboard: React.FC<Props> = (props) => {
  // props
  const settings = props.settings;
  const musicDisplay = props.musicDisplay;
  const mediaPlayer = props.mediaPlayer;
  const onResize = props.onResize;

  // fretboard positions
  const fretboardOpts = useMemo<FretboardJsOptions>(() => {
    switch (settings.fretMarkerDisplay) {
      case FretMarkerDisplay.None:
        return { dotFill: 'white' };
      case FretMarkerDisplay.Degree:
        return { dotText: (params: PositionFilterParams) => params.grade, dotFill: 'white' };
      case FretMarkerDisplay.Note:
        return { dotText: (params: PositionFilterParams) => params.note };
      default:
        return { dotFill: 'white' };
    }
  }, [settings.fretMarkerDisplay]);

  const cursorSnapshot = useMusicDisplayCursorSnapshot(musicDisplay);
  const tonic = useTonic(settings.selectedScale, musicDisplay);
  const pressedPositions = usePressedPositions(cursorSnapshot, mediaPlayer);
  const measurePositions = useMeasurePositions(cursorSnapshot);
  const pressedStyle = useMemo<Partial<PositionStyle>>(() => ({ fill: '#f5c2c5', stroke: '#f03e47' }), []);

  // dynamic scale management
  useEffect(() => {}, [settings.scaleSelectionType]);

  return (
    <Outer data-testid="fretboard">
      <FretboardJs
        tonic={tonic || undefined}
        options={fretboardOpts}
        styleMergeStrategy={MergeStrategy.Merge}
        onResize={onResize}
      >
        {measurePositions.map(({ string, fret }) => (
          <FretboardJs.Position
            key={`measure-${string}-${fret}`}
            string={string}
            fret={fret}
            style={{ fill: '#f9f9f9', stroke: '#a0a0a0' }}
          />
        ))}
        {pressedPositions.map(({ string, fret }) => (
          <FretboardJs.Position key={`pressed-${string}-${fret}`} string={string} fret={fret} style={pressedStyle} />
        ))}
        {settings.scaleSelectionType !== ScaleSelectionType.None && settings.selectedScale && (
          <FretboardJs.Scale name={settings.selectedScale} style={{ stroke: '#85f4fc' }} />
        )}
      </FretboardJs>
    </Outer>
  );
};
