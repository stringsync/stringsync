import React, { useEffect } from 'react';
import { useUuid } from '../../hooks/useUuid';
import { Tuning } from '../../lib/guitar/Tuning';
import { Position } from './Position';
import { Scale } from './Scale';
import { FretboardOptions, PositionFilterParams } from './types';
import { useFretboard } from './useFretboard';
import { useGuitar } from './useGuitar';
import { useStyleFilters } from './useStyleFilters';
import { useStyleTargets } from './useStyleTargets';

type Props = {
  opts: FretboardOptions;
  tuning: Tuning;
};

type ChildComponents = {
  Position: typeof Position;
  Scale: typeof Scale;
};

export const Fretboard: React.FC<Props> & ChildComponents = ({ opts, tuning, children }) => {
  const uuid = useUuid();
  const id = `fretboard-${uuid}`; // element ids must start with a letter
  const fretboard = useFretboard(id, tuning, opts);
  const guitar = useGuitar(tuning);
  const styleTargets = useStyleTargets(fretboard, children);
  const styleFilters = useStyleFilters(styleTargets);

  useEffect(() => {
    fretboard.setDots(
      styleTargets.map<PositionFilterParams>((styleTarget) => ({
        fret: styleTarget.position.fret,
        string: styleTarget.position.string,
        note: guitar.getPitchAt(styleTarget.position).toString(),
      }))
    );

    fretboard.render();

    styleFilters.forEach((styleFilter) => {
      fretboard.style({ filter: styleFilter.predicate, ...styleFilter.style });
    });
  }, [fretboard, guitar, styleFilters, styleTargets]);

  return <figure id={id} />;
};

Fretboard.Position = Position;
Fretboard.Scale = Scale;
