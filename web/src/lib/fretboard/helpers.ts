import { Fretboard, FretboardSystem } from '@moonwave99/fretboard.js';
import { Interval, Note } from '@tonaljs/tonal';
import { get, identity, isNull, merge, uniq } from 'lodash';
import React from 'react';
import { Position as GuitarPosition } from '../guitar/Position';
import { Position } from './Position';
import { Scale } from './Scale';
import { Slide } from './Slide';
import {
  MergeStrategy,
  PositionStyle,
  PositionStyleTarget,
  SlideStyleTarget,
  StyleTarget,
  StyleTargetType,
} from './types';

const CHILDREN_DISPLAY_NAMES = [Position.displayName, Scale.displayName].filter(identity);

type Component<C extends React.ComponentType<any>> = React.ReactElement<React.ComponentProps<C>>;

export const encodePosition = (position: GuitarPosition) => position.toString();

export const encodeStyle = (style: PositionStyle) => JSON.stringify(style);

export const getStyleTargets = (
  fretboard: Fretboard,
  children: React.ReactNode,
  mergeStrategy = MergeStrategy.Merge
): StyleTarget[] => {
  const styleTargets = new Array<StyleTarget>();
  React.Children.forEach(children, (child) => {
    styleTargets.push(...getStyleTargetsForChildType(fretboard, child));
  });
  return mergeStyleTargets(styleTargets, mergeStrategy);
};

const mergeStyles = (styleTargets: StyleTarget[]): StyleTarget[] => {
  const positionStyleTargets = styleTargets.filter(isPositionStyleTarget);
  const slideStyleTargets = styleTargets.filter(isSlideStyleTarget);

  const unioned: Record<string, StyleTarget> = {};
  for (const styleTarget of positionStyleTargets) {
    const position = encodePosition(styleTarget.position);
    if (position in unioned) {
      unioned[position] = merge(unioned[position], styleTarget);
    } else {
      unioned[position] = { ...styleTarget };
    }
  }

  const orderedPositions = positionStyleTargets.map(({ position }) => encodePosition(position));
  const uniqPositions = uniq(orderedPositions);
  return [...uniqPositions.map((position) => unioned[position]), ...slideStyleTargets];
};

const pickFirstStyles = (styleTargets: StyleTarget[]): StyleTarget[] => {
  const positionStyleTargets = styleTargets.filter(isPositionStyleTarget);
  const slideStyleTargets = styleTargets.filter(isSlideStyleTarget);

  const nextStyleTargets = new Array<StyleTarget>();
  const seen = new Set<string>();

  for (const styleTarget of positionStyleTargets) {
    const position = encodePosition(styleTarget.position);
    if (!seen.has(position)) {
      seen.add(position);
      nextStyleTargets.push(styleTarget);
    }
  }

  return [...nextStyleTargets, ...slideStyleTargets];
};

const pickLastStyles = (styleTargets: StyleTarget[]): StyleTarget[] => {
  const positionStyleTargets = styleTargets.filter(isPositionStyleTarget);
  const slideStyleTargets = styleTargets.filter(isSlideStyleTarget);

  const latest: Record<string, StyleTarget> = {};
  for (const styleTarget of positionStyleTargets) {
    const position = encodePosition(styleTarget.position);
    latest[position] = styleTarget;
  }

  const orderedPositions = positionStyleTargets.map(({ position }) => encodePosition(position));
  const uniqPositions = uniq(orderedPositions);
  return [...uniqPositions.map((position) => latest[position]), ...slideStyleTargets];
};

const mergeStyleTargets = (styleTargets: StyleTarget[], mergeStrategy: MergeStrategy): StyleTarget[] => {
  switch (mergeStrategy) {
    case MergeStrategy.Merge:
      return mergeStyles(styleTargets);
    case MergeStrategy.First:
      return pickFirstStyles(styleTargets);
    case MergeStrategy.Last:
      return pickLastStyles(styleTargets);
    default:
      throw new Error(`unknown merge strategy: ${mergeStrategy}`);
  }
};

const isComponentType = <C extends React.ComponentType<any>>(child: any, Component: C): child is Component<C> => {
  return React.isValidElement(child) && child.type === Component;
};

const getStyleTargetsForChildType = (fretboard: Fretboard, child: React.ReactNode): StyleTarget[] => {
  if (isNull(child)) {
    return [];
  }
  if (isComponentType(child, Position)) {
    return getStyleTargetsFromPositionComponent(child);
  }
  if (isComponentType(child, Scale)) {
    return getStyleTargetsFromScaleComponent(fretboard, child);
  }
  if (isComponentType(child, Slide)) {
    return getStyleTargetsFromSlideComponent(child);
  }
  throw new Error(`Fretboard children must be one of: ${CHILDREN_DISPLAY_NAMES}, got ${child}`);
};

const getStyleTargetsFromPositionComponent = (child: Component<typeof Position>): StyleTarget[] => {
  const { fret, string, style } = child.props;
  return [
    {
      type: StyleTargetType.Position,
      position: new GuitarPosition(fret, string),
      style: { ...style },
    },
  ];
};

const getStyleTargetsFromScaleComponent = (fretboard: Fretboard, child: Component<typeof Scale>): StyleTarget[] => {
  const { name, style } = child.props;
  const nameParts = name.split(' ');
  const [root, ...rest] = nameParts;
  const type = rest.join(' ');

  const system: FretboardSystem | null = get(fretboard, 'system', null);
  if (!(system instanceof FretboardSystem)) {
    console.warn('fretboard system hack is broken, manually create a system instead');
    return [];
  }
  const positions = system.getScale({ type, root });
  return positions.map((position) => ({
    type: StyleTargetType.Position,
    position: new GuitarPosition(position.fret, position.string),
    style: { ...style },
  }));
};

const getStyleTargetsFromSlideComponent = (child: Component<typeof Slide>): StyleTarget[] => {
  const { from, to, style } = child.props;
  if (from.string !== to.string) {
    console.warn(`cannot get style targets for a slide that moves strings: from=${from}, to=${to}`);
    return [];
  }
  return [{ type: StyleTargetType.Slide, string: from.string, frets: [from.fret, to.fret], style: { ...style } }];
};

export const getEnharmonic = (note: string) => Note.simplify(Note.enharmonic(note));

const GRADES = ['1', 'b2', '2', 'b3', '3', '4', 'b5', '5', '#5', '6', 'b7', '7'];

export const getGradesByNote = (tonic: string): Record<string, string> => {
  const gradesByNote: Record<string, string> = {};

  const isTonic = (note: string) => note === tonic || getEnharmonic(note) === tonic;
  const enharmonicsOf = (note: string) => uniq([note, getEnharmonic(note)].filter(identity));
  const next = (note: string) => Note.simplify(Note.transpose(note, Interval.fromSemitones(1)));

  let ndx = 0;
  let note = tonic;
  do {
    const grade = GRADES[ndx % GRADES.length];
    enharmonicsOf(note).forEach((enharmonic) => {
      gradesByNote[enharmonic] = grade;
    });
    note = next(note);
    ndx++;
  } while (!isTonic(note));

  return gradesByNote;
};

export const isPositionStyleTarget = (value: any): value is PositionStyleTarget => {
  return value.type === StyleTargetType.Position;
};

export const isSlideStyleTarget = (value: any): value is SlideStyleTarget => {
  return value.type === StyleTargetType.Slide;
};

export const getFretboardEl = (container: HTMLElement): Element | null => {
  return container.getElementsByClassName('fretbard-html-wrapper')[0] || null;
};

export const getPositionEl = (container: HTMLElement, position: Position): Element | null => {
  return container.getElementsByClassName(`dot-fret-${position.fret} dot-string-${position.string}`)[0];
};

export const getAllPositionEls = (container: HTMLElement) => {
  return container.getElementsByClassName('dot-circle');
};

export const getPositionElsByFret = (container: HTMLElement, fret: number) => {
  return container.getElementsByClassName(`dot-fret-${fret}`);
};

export const getPositionElsByString = (container: HTMLElement, string: number) => {
  return container.getElementsByClassName(`dot-string-${string}`);
};

export const getPositionElsByNote = (container: HTMLElement, note: string) => {
  return container.getElementsByClassName(`dot-note-${note}`);
};

export const getStyleAtPosition = (container: HTMLElement, position: Position): PositionStyle | null => {
  const positionEl = getPositionEl(container, position);
  if (!positionEl) {
    return null;
  }

  const circleEl = positionEl.getElementsByTagName('circle')[0];
  if (!circleEl) {
    return null;
  }

  const style: PositionStyle = {};

  const stroke = circleEl.getAttribute('stroke');
  if (stroke) {
    style.stroke = stroke;
  }
  const fill = circleEl.getAttribute('fill');
  if (fill) {
    style.fill = fill;
  }

  return style;
};
