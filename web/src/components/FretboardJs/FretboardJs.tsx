import React, { useEffect } from 'react';
import { DotStyleFilter } from '.';
import { useUuid } from '../../hooks/useUuid';
import { Position } from '../../lib/guitar/Position';
import { Tuning } from '../../lib/guitar/Tuning';
import { DotFilterParams, DotStyle, FretboardOptions } from './types';
import { useFretboard } from './useFretboard';
import { useGuitar } from './useGuitar';

const DEFAULT_DOT_STYLE: Readonly<DotStyle> = {
  stroke: 'black',
  fill: 'white',
};

type Props = {
  opts: FretboardOptions;
  tuning: Tuning;
  positions: Position[];
  dotStyleFilters: DotStyleFilter[];
};

export const FretboardJs: React.FC<Props> = ({ opts, positions, tuning, dotStyleFilters: styleFilters }) => {
  const uuid = useUuid();
  const id = `fretboard-${uuid}`; // ids must start with a letter
  const fretboard = useFretboard(id, tuning, opts);
  const guitar = useGuitar(tuning);

  useEffect(() => {
    fretboard.setDots(
      positions.map<DotFilterParams>((position) => ({
        fret: position.fret,
        string: position.string,
        note: guitar.getPitchAt(position).toString(),
      }))
    );

    fretboard.render();

    styleFilters.forEach((styleFilter) => {
      fretboard.style({
        filter: styleFilter.predicate,
        ...DEFAULT_DOT_STYLE,
        ...styleFilter.dotStyle,
      });
    });
  }, [fretboard, guitar, positions, styleFilters]);

  return <figure id={id} />;
};
