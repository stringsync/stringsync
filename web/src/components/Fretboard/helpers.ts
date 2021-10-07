import { Fretboard, FretboardSystem } from '@moonwave99/fretboard.js';
import { get, identity, isNull, merge, uniq } from 'lodash';
import React from 'react';
import { StyleTarget } from '.';
import { Position as GuitarPosition } from '../../lib/guitar/Position';
import { Position } from './Position';
import { Scale } from './Scale';
import { MergeStrategy, PositionStyle } from './types';

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
  const unioned: Record<string, StyleTarget> = {};
  for (const styleTarget of styleTargets) {
    const position = encodePosition(styleTarget.position);
    if (position in unioned) {
      unioned[position] = merge(unioned[position], styleTarget);
    } else {
      unioned[position] = { ...styleTarget };
    }
  }

  const orderedPositions = styleTargets.map(({ position }) => encodePosition(position));
  const uniqPositions = uniq(orderedPositions);
  return uniqPositions.map((position) => unioned[position]);
};

const pickFirstStyles = (styleTargets: StyleTarget[]): StyleTarget[] => {
  const nextStyleTargets = new Array<StyleTarget>();
  const seen = new Set<string>();

  for (const styleTarget of styleTargets) {
    const position = encodePosition(styleTarget.position);
    if (!seen.has(position)) {
      seen.add(position);
      nextStyleTargets.push(styleTarget);
    }
  }

  return nextStyleTargets;
};

const pickLastStyles = (styleTargets: StyleTarget[]): StyleTarget[] => {
  const latest: Record<string, StyleTarget> = {};
  for (const styleTarget of styleTargets) {
    const position = encodePosition(styleTarget.position);
    latest[position] = styleTarget;
  }

  const orderedPositions = styleTargets.map(({ position }) => encodePosition(position));
  const uniqPositions = uniq(orderedPositions);
  return uniqPositions.map((position) => latest[position]);
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
  throw new Error(`Fretboard children must be one of: ${CHILDREN_DISPLAY_NAMES}, got ${child}`);
};

const getStyleTargetsFromPositionComponent = (child: Component<typeof Position>): StyleTarget[] => {
  const { fret, string, style } = child.props;
  return [
    {
      position: new GuitarPosition(fret, string),
      style: { ...style },
    },
  ];
};

const getStyleTargetsFromScaleComponent = (fretboard: Fretboard, child: Component<typeof Scale>): StyleTarget[] => {
  const { name, style } = child.props;
  const nameParts = name.split(' ');
  if (nameParts.length !== 2) {
    console.warn(`got more than 2 name parts, not rendering scale: ${nameParts}`);
    return [];
  }
  const [root, type] = nameParts;

  const system: FretboardSystem | null = get(fretboard, 'system', null);
  if (!(system instanceof FretboardSystem)) {
    console.warn('fretboard system hack is broken, manually create a system instead');
    return [];
  }
  const positions = system.getScale({ type, root });
  return positions.map((position) => ({
    position: new GuitarPosition(position.fret, position.string),
    style: { ...style },
  }));
};
