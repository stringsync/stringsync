import { uniqBy } from 'lodash';
import { useEffect, useState } from 'react';
import { Position as GuitarPosition } from '../../lib/guitar/Position';
import { PositionFilterParams, PositionStyle, StyleFilter, StyleTarget } from './types';

const encodePosition = (position: GuitarPosition) => position.toString();
const encodeStyle = (style: PositionStyle) => JSON.stringify(style);

export const useStyleFilters = (styleTargets: StyleTarget[]) => {
  const [styleFilters, setStyleFilters] = useState<StyleFilter[]>([]);

  useEffect(() => {
    const positionsByStyle: Record<string, Set<string>> = {};
    const latestStyleByPosition: Record<string, string> = {};

    for (const styleTarget of styleTargets) {
      // Encode position and style objects to strings so they can be used
      // as keys in objects.
      const position = encodePosition(styleTarget.position);
      const style = encodeStyle(styleTarget.style);

      // If the position was seen before, make sure it doesn't get styled
      // by a previous style target. We only care about the end state.
      if (position in latestStyleByPosition) {
        const latestStyle = latestStyleByPosition[position];
        delete latestStyleByPosition[position];
        positionsByStyle[latestStyle].delete(position);
        if (positionsByStyle[latestStyle].size === 0) {
          delete positionsByStyle[latestStyle];
        }
      }

      // Associate the style with the position.
      if (!(style in positionsByStyle)) {
        positionsByStyle[style] = new Set();
      }
      positionsByStyle[style].add(position);
      latestStyleByPosition[position] = style;
    }

    const styles = styleTargets.map(({ style }) => style);
    const uniqueStyles = uniqBy(styles, (style) => JSON.stringify(style));
    const nextStyleFilters = uniqueStyles.map((uniqueStyle) => {
      return {
        predicate: (params: PositionFilterParams) => {
          const position = encodePosition(new GuitarPosition(params.fret, params.string));
          const style = encodeStyle(uniqueStyle);
          return style in positionsByStyle && positionsByStyle[style].has(position);
        },
        style: uniqueStyle,
      };
    });

    setStyleFilters(nextStyleFilters);
  }, [styleTargets]);

  return styleFilters;
};
