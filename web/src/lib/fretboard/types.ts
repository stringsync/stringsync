import { Options } from '@moonwave99/fretboard.js/dist/fretboard/Fretboard';
import { Position as GuitarPosition } from '../guitar/Position';

export type FretboardJsOptions = Partial<Omit<Options, 'el' | 'tuning'>>;

export type PositionStyle = Partial<{
  stroke: string;
  fill: string;
}>;

export type PlainPosition = {
  fret: number;
  string: number;
};

export enum StyleTargetType {
  Position,
  HammerOn,
  PullOff,
  Slide,
  Tap,
}

export type PositionStyleTarget = {
  type: StyleTargetType.Position;
  style: PositionStyle;
  position: GuitarPosition;
};

export type SlideStyleTarget = {
  type: StyleTargetType.Slide;
  style: PositionStyle;
  string: number;
  frets: [number, number];
};

export type HammerOnStyleTarget = {
  type: StyleTargetType.HammerOn;
  style: PositionStyle;
  string: number;
  frets: [number, number];
};

export type PullOffStyleTarget = {
  type: StyleTargetType.PullOff;
  style: PositionStyle;
  string: number;
  frets: [number, number];
};

export type StyleTarget = PositionStyleTarget | SlideStyleTarget | HammerOnStyleTarget | PullOffStyleTarget;

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
