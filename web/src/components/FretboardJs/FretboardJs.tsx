import React, { useEffect } from 'react';
import { useUuid } from '../../hooks/useUuid';
import { Position } from '../../lib/guitar/Position';
import { FretboardOptions, useFretboard } from './useFretboardJs';

export type Style = {
  stroke: string;
  fill: string;
};

export type StyledPosition = {
  style: Partial<Style>;
  position: Position;
};

type Props = {
  opts: FretboardOptions;
  styledPositions: Position[];
};

export const FretboardJs: React.FC<Props> = ({ opts, styledPositions }) => {
  const id = useUuid();

  const fretboard = useFretboard(id, opts);

  useEffect(() => {
    fretboard
      .setDots([
        { fret: 5, string: 2 },
        { fret: 2, string: 5 },
      ])
      .render()
      .style({
        filter: () => Math.random() > 0.5,
        text: (unk: any) => {
          console.log(unk);
          return 'A';
        },
        fontFill: 'red',
      });
  }, [fretboard, styledPositions]);

  return <figure id={id} />;
};
