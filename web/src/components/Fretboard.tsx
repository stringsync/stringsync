import { Alert } from 'antd';
import { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { useDimensions } from '../hooks/useDimensions';
import { useMeasurePositions } from '../hooks/useMeasurePositions';
import { useMusicDisplayCursorSnapshot } from '../hooks/useMusicDisplayCursorSnapshot';
import { usePressedPositions } from '../hooks/usePressedPositions';
import { useTies } from '../hooks/useTies';
import { useTonic } from '../hooks/useTonic';
import * as fretboard from '../lib/fretboard';
import { MediaPlayer } from '../lib/MediaPlayer';
import { MusicDisplay } from '../lib/MusicDisplay';
import { Tie, TieType } from '../lib/MusicDisplay/locator';
import * as notations from '../lib/notations';
import { FretMarkerDisplay, ScaleSelectionType } from '../lib/notations';
import { FretboardJs, FretboardJsProps } from './FretboardJs';

const Outer = styled.div`
  z-index: 3;
  background-color: white;
  position: relative;

  figure {
    margin: 0;
  }
`;

const ScaleOuter = styled.div`
  z-index: 100;
  position: absolute;
  top: -24px;
  left: 12px;
`;

type Props = FretboardJsProps & {
  musicDisplay: MusicDisplay;
  mediaPlayer: MediaPlayer;
  fretMarkerDisplay?: FretMarkerDisplay;
  selectedScale?: string | null;
  scaleSelectionType?: ScaleSelectionType;
};

export const Fretboard: React.FC<Props> = (props) => {
  // props
  const musicDisplay = props.musicDisplay;
  const mediaPlayer = props.mediaPlayer;
  const onResize = props.onResize;
  const fretMarkerDisplay = props.fretMarkerDisplay ?? FretMarkerDisplay.None;
  const selectedScale = props.selectedScale ?? null;
  const scaleSelectionType = props.scaleSelectionType ?? ScaleSelectionType.None;

  // num frets
  const [fretCount, setFretCount] = useState(() => notations.getFretCount(0));
  const outerRef = useRef<HTMLDivElement>(null);
  const { width } = useDimensions(outerRef.current);
  useEffect(() => {
    setFretCount(notations.getFretCount(width));
  }, [width]);

  // fretboard positions
  const fretboardOpts = useMemo<fretboard.FretboardJsOptions>(() => {
    switch (fretMarkerDisplay) {
      case notations.FretMarkerDisplay.None:
        return { fretCount, dotFill: 'white' };
      case notations.FretMarkerDisplay.Degree:
        return { fretCount, dotText: (params: fretboard.PositionFilterParams) => params.grade, dotFill: 'white' };
      case notations.FretMarkerDisplay.Note:
        return { fretCount, dotText: (params: fretboard.PositionFilterParams) => params.note };
      default:
        return { fretCount, dotFill: 'white' };
    }
  }, [fretMarkerDisplay, fretCount]);

  const cursorSnapshot = useMusicDisplayCursorSnapshot(musicDisplay);
  const tonic = useTonic(selectedScale, musicDisplay);
  const pressedPositions = usePressedPositions(cursorSnapshot, mediaPlayer);
  const measurePositions = useMeasurePositions(cursorSnapshot);
  const ties = useTies(cursorSnapshot);
  const [slides, hammerOns, pullOffs] = useMemo(() => {
    const slides = new Array<Tie>();
    const hammerOns = new Array<Tie>();
    const pullOffs = new Array<Tie>();

    for (const tie of ties) {
      switch (tie.type) {
        case TieType.Slide:
          slides.push(tie);
          break;
        case TieType.HammerOn:
          hammerOns.push(tie);
          break;
        case TieType.PullOff:
          pullOffs.push(tie);
          break;
      }
    }

    return [slides, hammerOns, pullOffs];
  }, [ties]);

  return (
    <Outer data-testid="fretboard" ref={outerRef}>
      {scaleSelectionType !== ScaleSelectionType.None && selectedScale && (
        <ScaleOuter>
          <Alert type="info" message={<small>{selectedScale}</small>} style={{ padding: '2px 8px' }} />
        </ScaleOuter>
      )}

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
          <FretboardJs.Position
            key={`pressed-${string}-${fret}`}
            string={string}
            fret={fret}
            style={{ fill: '#f17e84', stroke: '#f17e84' }}
          />
        ))}
        {scaleSelectionType !== notations.ScaleSelectionType.None && selectedScale && (
          <FretboardJs.Scale name={selectedScale} style={{ stroke: '#111' }} />
        )}
        {slides.map(({ from, to }) => (
          <FretboardJs.Slide
            key={`slide-${JSON.stringify(from)}-${JSON.stringify(to)}`}
            from={from}
            to={to}
            style={{ fill: '#f5c2c5', stroke: '#f5c2c5' }}
          />
        ))}
        {hammerOns.map(({ from, to }) => (
          <FretboardJs.HammerOn
            key={`hammer-on-${JSON.stringify(from)}-${JSON.stringify(to)}`}
            from={from}
            to={to}
            style={{ fill: '#f5c2c5', stroke: '#f5c2c5' }}
          />
        ))}
        {pullOffs.map(({ from, to }) => (
          <FretboardJs.PullOff
            key={`pull-off-${JSON.stringify(from)}-${JSON.stringify(to)}`}
            from={from}
            to={to}
            style={{ fill: '#f5c2c5', stroke: '#f5c2c5' }}
          />
        ))}
      </FretboardJs>
    </Outer>
  );
};
