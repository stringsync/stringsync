import { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { useDimensions } from '../../hooks/useDimensions';
import * as fretboard from '../../lib/fretboard';
import { MediaPlayer } from '../../lib/MediaPlayer';
import { MusicDisplay } from '../../lib/MusicDisplay';
import { FretboardJs, FretboardJsProps } from '../FretboardJs';
import * as helpers from './helpers';
import { FretMarkerDisplay, NotationSettings, ScaleSelectionType } from './types';
import { useMeasurePositions } from './useMeasurePositions';
import { useMeasureSlideTransition as useMeasureSlideTransitions } from './useMeasureSlideTransitions';
import { useMusicDisplayCursorSnapshot } from './useMusicDisplayCursorSnapshot';
import { usePressedPositions } from './usePressedPositions';
import { useTonic } from './useTonic';

const Outer = styled.div`
  z-index: 3;
  background-color: white;
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

  // num frets
  const [fretCount, setFretCount] = useState(() => helpers.getFretCount(0));
  const outerRef = useRef<HTMLDivElement>(null);
  const { width } = useDimensions(outerRef.current);
  useEffect(() => {
    setFretCount(helpers.getFretCount(width));
  }, [width]);

  // fretboard positions
  const fretboardOpts = useMemo<fretboard.FretboardJsOptions>(() => {
    switch (settings.fretMarkerDisplay) {
      case FretMarkerDisplay.None:
        return { fretCount, dotFill: 'white' };
      case FretMarkerDisplay.Degree:
        return { fretCount, dotText: (params: fretboard.PositionFilterParams) => params.grade, dotFill: 'white' };
      case FretMarkerDisplay.Note:
        return { fretCount, dotText: (params: fretboard.PositionFilterParams) => params.note };
      default:
        return { fretCount, dotFill: 'white' };
    }
  }, [settings.fretMarkerDisplay, fretCount]);

  const cursorSnapshot = useMusicDisplayCursorSnapshot(musicDisplay);
  const tonic = useTonic(settings.selectedScale, musicDisplay);
  const pressedPositions = usePressedPositions(cursorSnapshot, mediaPlayer);
  const measurePositions = useMeasurePositions(cursorSnapshot);
  const measureSlideTransitions = useMeasureSlideTransitions(cursorSnapshot);
  const pressedStyle = useMemo<Partial<fretboard.PositionStyle>>(() => ({ fill: '#f17e84', stroke: '#f17e84' }), []);

  // dynamic scale management
  useEffect(() => {}, [settings.scaleSelectionType]);

  return (
    <Outer data-testid="fretboard" ref={outerRef}>
      <FretboardJs
        tonic={tonic || undefined}
        options={fretboardOpts}
        styleMergeStrategy={fretboard.MergeStrategy.Merge}
        onResize={onResize}
      >
        {measurePositions.map(({ string, fret }) => (
          <FretboardJs.Position
            key={`measure-${string}-${fret}`}
            string={string}
            fret={fret}
            style={{ fill: '#fae1e3', stroke: '#fae1e3' }}
          />
        ))}
        {pressedPositions.map(({ string, fret }) => (
          <FretboardJs.Position key={`pressed-${string}-${fret}`} string={string} fret={fret} style={pressedStyle} />
        ))}
        {settings.scaleSelectionType !== ScaleSelectionType.None && settings.selectedScale && (
          <FretboardJs.Scale name={settings.selectedScale} style={{ stroke: '#111' }} />
        )}
        {measureSlideTransitions.map(({ from, to }) => (
          <FretboardJs.Slide
            key={`slide-${JSON.stringify(from)}-${JSON.stringify(to)}`}
            from={from}
            to={to}
            style={{ fill: '#f5c2c5', stroke: '#f5c2c5' }}
          />
        ))}
      </FretboardJs>
    </Outer>
  );
};
