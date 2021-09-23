import { Options } from '@moonwave99/fretboard.js/dist/fretboard/Fretboard';

export type FretboardOptions = Partial<Omit<Options, 'el' | 'tuning'>>;

export type DotStyle = {
  stroke: string;
  fill: string;
};

export type DotFilterParams = {
  fret: number;
  string: number;
  note: string;
};

export type DotStyleFilter = {
  dotStyle: Partial<DotStyle>;
  predicate: (params: DotFilterParams) => boolean;
};
