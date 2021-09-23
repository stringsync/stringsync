import { merge, uniq } from 'lodash';
import { StyleTarget } from '.';
import { Position as GuitarPosition } from '../../lib/guitar/Position';
import { MergeStrategy, PositionStyle } from './types';

export const encodePosition = (position: GuitarPosition) => position.toString();

export const encodeStyle = (style: PositionStyle) => JSON.stringify(style);

const unionizeStyles = (styleTargets: StyleTarget[]): StyleTarget[] => {
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

export const mergeStyleTargets = (styleTargets: StyleTarget[], mergeStrategy = MergeStrategy.Union): StyleTarget[] => {
  switch (mergeStrategy) {
    case MergeStrategy.Union:
      return unionizeStyles(styleTargets);
    case MergeStrategy.First:
      return pickFirstStyles(styleTargets);
    case MergeStrategy.Last:
      return pickLastStyles(styleTargets);
    default:
      throw new Error(`unknown merge strategy: ${mergeStrategy}`);
  }
};
