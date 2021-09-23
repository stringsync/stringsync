import { Options } from '@moonwave99/fretboard.js/dist/fretboard/Fretboard';
import { Position as GuitarPosition } from '../../lib/guitar/Position';

export type FretboardOptions = Partial<Omit<Options, 'el' | 'tuning'>>;

export type PositionStyle = {
  stroke: string;
  fill: string;
};

export type StyleTarget = {
  style: PositionStyle;
  position: GuitarPosition;
};

export type PositionFilterParams = {
  fret: number;
  string: number;
  note: string;
};

export type StyleFilter = {
  style: PositionStyle;
  predicate: (params: PositionFilterParams) => boolean;
};
