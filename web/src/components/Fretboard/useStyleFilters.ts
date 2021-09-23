import { useEffect, useState } from 'react';
import { Position as GuitarPosition } from '../../lib/guitar/Position';
import * as helpers from './helpers';
import { PositionFilterParams, StyleFilter, StyleTarget } from './types';

export const useStyleFilters = (styleTargets: StyleTarget[]) => {
  const [styleFilters, setStyleFilters] = useState<StyleFilter[]>([]);

  useEffect(() => {
    const positionsByStyle: Record<string, Set<string>> = {};
    for (const styleTarget of styleTargets) {
      const style = helpers.encodeStyle(styleTarget.style);
      const position = helpers.encodePosition(styleTarget.position);

      if (style in positionsByStyle) {
        positionsByStyle[style].add(position);
      } else {
        positionsByStyle[style] = new Set([position]);
      }
    }

    const nextStyleFilters = styleTargets.map((styleTarget) => {
      const positions = positionsByStyle[helpers.encodeStyle(styleTarget.style)];
      return {
        predicate: (params: PositionFilterParams) => {
          const position = new GuitarPosition(params.fret, params.string);
          return positions.has(helpers.encodePosition(position));
        },
        style: styleTarget.style,
      };
    });

    setStyleFilters(nextStyleFilters);
  }, [styleTargets]);

  return styleFilters;
};
