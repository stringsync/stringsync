import { isEqual } from 'lodash';
import React, { useEffect, useState } from 'react';
import { Position as GuitarPosition } from '../../lib/guitar/Position';
import { Position } from './Position';
import { PositionStyle, StyleTarget } from './types';

const DEFAULT_POSITION_STYLE: Readonly<PositionStyle> = {
  stroke: 'black',
  fill: 'white',
};

const isPositionComponent = (child: any): child is React.ReactElement<React.ComponentProps<typeof Position>> => {
  return React.isValidElement(child) && child.type === Position;
};

export const useStyleTargets = (children: React.ReactNode) => {
  const [styleTargets, setStyleTargets] = useState<StyleTarget[]>([]);

  useEffect(() => {
    const nextStyleTargets =
      React.Children.map<StyleTarget, React.ReactNode>(children, (child) => {
        if (isPositionComponent(child)) {
          return {
            style: { ...DEFAULT_POSITION_STYLE, ...child.props.style },
            position: new GuitarPosition(child.props.fret, child.props.string),
          };
        }
        throw new Error(`Fretboard children must be one of: ${Position.displayName}, got ${child}`);
      }) || [];

    setStyleTargets((currentStyleTargets) => {
      // Prevent unecessary renders by maintaining the same styleTargets object in memory if it hasn't changed.
      return isEqual(currentStyleTargets, nextStyleTargets) ? currentStyleTargets : nextStyleTargets;
    });
  }, [children]);

  return styleTargets;
};
