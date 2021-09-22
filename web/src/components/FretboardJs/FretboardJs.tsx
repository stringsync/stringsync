import React, { useEffect } from 'react';
import { useUuid } from '../../hooks/useUuid';
import { Position } from '../../lib/guitar/Position';
import { Tuning } from '../../lib/guitar/Tuning';
import { FretboardOptions, useFretboard } from './useFretboard';
import { useGuitar } from './useGuitar';

const DEFAULT_STYLE: Readonly<Style> = {
  stroke: 'black',
  fill: 'white',
};

export type Style = {
  stroke: string;
  fill: string;
};

export type FilterParams = {
  fret: number;
  string: number;
  note: string;
};

export type StyleFilter = {
  style: Partial<Style>;
  predicate: (params: FilterParams) => boolean;
};

type Props = {
  opts: FretboardOptions;
  tuning: Tuning;
  positions: Position[];
  styleFilters: StyleFilter[];
};

export const FretboardJs: React.FC<Props> = ({ opts, positions, tuning, styleFilters }) => {
  const uuid = useUuid();
  const id = `fretboard-${uuid}`; // ids must start with a letter
  const fretboard = useFretboard(id, tuning, opts);
  const guitar = useGuitar(tuning);

  useEffect(() => {
    fretboard.setDots(
      positions.map<FilterParams>((position) => ({
        fret: position.fret,
        string: position.string,
        note: guitar.getPitchAt(position).toString(),
      }))
    );

    fretboard.render();

    styleFilters.forEach((styleFilter) => {
      fretboard.style({
        filter: styleFilter.predicate,
        ...DEFAULT_STYLE,
        ...styleFilter.style,
      });
    });
  }, [fretboard, guitar, positions, styleFilters]);

  return <figure id={id} />;
};
