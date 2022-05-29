import { useEffect, useState } from 'react';
import * as fretboard from '../lib/fretboard';
import { Position as GuitarPosition } from '../lib/guitar/Position';

export const useStyleFilters = (styleTargets: fretboard.PositionStyleTarget[]) => {
  const [styleFilters, setStyleFilters] = useState<fretboard.StyleFilter[]>([]);

  useEffect(() => {
    const positionsByStyle: Record<string, Set<string>> = {};
    for (const styleTarget of styleTargets) {
      const style = fretboard.encodeStyle(styleTarget.style);
      const position = fretboard.encodePosition(styleTarget.position);

      if (style in positionsByStyle) {
        positionsByStyle[style].add(position);
      } else {
        positionsByStyle[style] = new Set([position]);
      }
    }

    const nextStyleFilters = styleTargets.map((styleTarget) => {
      const positions = positionsByStyle[fretboard.encodeStyle(styleTarget.style)];
      return {
        predicate: (params: fretboard.PositionFilterParams) => {
          const position = new GuitarPosition(params.fret, params.string);
          return positions.has(fretboard.encodePosition(position));
        },
        style: styleTarget.style,
      };
    });

    setStyleFilters(nextStyleFilters);
  }, [styleTargets]);

  return styleFilters;
};
