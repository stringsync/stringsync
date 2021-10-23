import { Key } from '@tonaljs/tonal';
import React, { useEffect, useRef } from 'react';
import { Tuning } from '../../lib/guitar/Tuning';
import * as helpers from './helpers';
import { Position } from './Position';
import { Scale } from './Scale';
import { FretboardJsOptions, MergeStrategy, PositionFilterParams } from './types';
import { useFretboard } from './useFretboard';
import { useGuitar } from './useGuitar';
import { useStyleFilters } from './useStyleFilters';
import { useStyleTargets } from './useStyleTargets';

const DEFAULT_TONIC = 'C';
const DEFAULT_TUNING = Tuning.standard();
const DEFAULT_OPTIONS: FretboardJsOptions = {};

export type FretboardJsProps = {
  options?: FretboardJsOptions;
  tonic?: string;
  tuning?: Tuning;
  styleMergeStrategy?: MergeStrategy;
  onResize?: (dimmensions: { width: number; height: number }) => void;
};

export type FretboardJsChildComponents = {
  Position: typeof Position;
  Scale: typeof Scale;
};

export const FretboardJs: React.FC<FretboardJsProps> & FretboardJsChildComponents = (props) => {
  const tonic = props.tonic || DEFAULT_TONIC;
  const options = props.options || DEFAULT_OPTIONS;
  const tuning = props.tuning || DEFAULT_TUNING;
  const styleMergeStrategy = props.styleMergeStrategy || MergeStrategy.Merge;
  const figureRef = useRef<HTMLElement>(null);
  const onResize = props.onResize;

  const fretboard = useFretboard(figureRef, tuning, options);
  const guitar = useGuitar(tuning);
  const styleTargets = useStyleTargets(fretboard, props.children, styleMergeStrategy);
  const styleFilters = useStyleFilters(styleTargets);

  useEffect(() => {
    const figure = figureRef.current;
    if (!figure) {
      return;
    }
    if (!onResize) {
      return;
    }
    const reseizeObserver = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      onResize({ width, height });
    });
    reseizeObserver.observe(figure);
    return () => {
      reseizeObserver.disconnect();
    };
  }, [figureRef, onResize]);

  useEffect(() => {
    const gradesByNote = helpers.getGradesByNote(tonic);
    const key = Key.majorKey(tonic);
    const scale = new Set(key.scale);

    fretboard.setDots(
      styleTargets.map<PositionFilterParams>((styleTarget) => {
        const pitch = guitar.getPitchAt(styleTarget.position);
        const enharmonic1 = pitch.toString();
        const enharmonic2 = helpers.getEnharmonic(enharmonic1);
        const hasEnharmonic = enharmonic1 !== enharmonic2;
        const isKeySharp = key.alteration > 0;
        const isKeyFlat = key.alteration < 0;
        const isKeyNatural = key.alteration === 0;

        let note: string;
        if (!hasEnharmonic) {
          note = enharmonic1;
        } else if (scale.has(enharmonic1)) {
          note = enharmonic1;
        } else if (scale.has(enharmonic2)) {
          note = enharmonic2;
        } else if (isKeySharp) {
          note = [enharmonic1, enharmonic2].find((enharmonic) => enharmonic.includes('#')) || '';
        } else if (isKeyFlat) {
          note = [enharmonic1, enharmonic2].find((enharmonic) => enharmonic.includes('b')) || '';
        } else if (isKeyNatural) {
          note = [enharmonic1, enharmonic2].find((enharmonic) => enharmonic.length === 1) || '';
        } else {
          note = enharmonic1;
        }

        return {
          fret: styleTarget.position.fret,
          string: styleTarget.position.string,
          note,
          grade: gradesByNote[note],
          octave: pitch.octave,
        };
      })
    );

    fretboard.render();

    styleFilters.forEach((styleFilter) => {
      fretboard.style({ filter: styleFilter.predicate, ...styleFilter.style });
    });
  }, [fretboard, guitar, styleFilters, styleTargets, tonic]);

  return <figure ref={figureRef} />;
};

FretboardJs.Position = Position;
FretboardJs.Scale = Scale;
