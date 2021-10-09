import { Options } from '@moonwave99/fretboard.js/dist/fretboard/Fretboard';
import { Position as GuitarPosition } from '../../lib/guitar/Position';

export type FretboardOptions = Partial<Omit<Options, 'el' | 'tuning'>>;

export type PositionStyle = Partial<{
  stroke: string;
  fill: string;
}>;

export type StyleTarget = {
  style: PositionStyle;
  position: GuitarPosition;
};

export type PositionFilterParams = {
  fret: number;
  string: number;
  note: string;
  grade: string;
  octave: number;
};

export type StyleFilter = {
  style: PositionStyle;
  predicate: (params: PositionFilterParams) => boolean;
};

export enum MergeStrategy {
  Merge,
  First,
  Last,
}
