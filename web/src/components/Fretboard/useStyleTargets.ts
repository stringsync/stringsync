import { isEqual } from 'lodash';
import React, { useEffect, useState } from 'react';
import { Position as GuitarPosition } from '../../lib/guitar/Position';
import * as helpers from './helpers';
import { Position } from './Position';
import { StyleTarget } from './types';

const isPositionComponent = (child: any): child is React.ReactElement<React.ComponentProps<typeof Position>> => {
  return React.isValidElement(child) && child.type === Position;
};

export const useStyleTargets = (children: React.ReactNode) => {
  const [styleTargets, setStyleTargets] = useState<StyleTarget[]>([]);

  useEffect(() => {
    const rawStyleTargets =
      React.Children.map<StyleTarget, React.ReactNode>(children, (child) => {
        if (isPositionComponent(child)) {
          return {
            style: { ...child.props.style },
            position: new GuitarPosition(child.props.fret, child.props.string),
          };
        }
        throw new Error(`Fretboard children must be one of: ${Position.displayName}, got ${child}`);
      }) || [];

    const nextStyleTargets = helpers.mergeStyleTargets(rawStyleTargets);

    setStyleTargets((currentStyleTargets) => {
      // Prevent unecessary renders by maintaining the same styleTargets object in memory if it hasn't changed.
      return isEqual(currentStyleTargets, nextStyleTargets) ? currentStyleTargets : nextStyleTargets;
    });
  }, [children]);

  return styleTargets;
};
