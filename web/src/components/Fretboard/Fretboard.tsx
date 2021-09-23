import { uniqBy } from 'lodash';
import React, { useEffect, useMemo } from 'react';
import { PositionStyleFilter } from '.';
import { useUuid } from '../../hooks/useUuid';
import { Position as GuitarPosition } from '../../lib/guitar/Position';
import { Tuning } from '../../lib/guitar/Tuning';
import * as assertions from './assertions';
import { Position } from './Position';
import { FretboardOptions, PositionFilterParams, PositionStyle, StyleTarget } from './types';
import { useFretboard } from './useFretboard';
import { useGuitar } from './useGuitar';

const DEFAULT_POSITION_STYLE: Readonly<PositionStyle> = {
  stroke: 'black',
  fill: 'white',
};

type Props = {
  opts: FretboardOptions;
  tuning: Tuning;
};

type ChildComponents = {
  Position: typeof Position;
};

const encodePosition = (position: GuitarPosition) => position.toString();
const encodeStyle = (style: PositionStyle) => JSON.stringify(style);

export const Fretboard: React.FC<Props> & ChildComponents = ({ opts, tuning, children }) => {
  const uuid = useUuid();
  const id = `fretboard-${uuid}`; // ids must start with a letter
  const fretboard = useFretboard(id, tuning, opts);
  const guitar = useGuitar(tuning);

  const styleTargets = useMemo(() => {
    return (
      React.Children.map<StyleTarget, React.ReactNode>(children, (child) => {
        if (assertions.isPositionComponent(child)) {
          return {
            style: { ...DEFAULT_POSITION_STYLE, ...child.props.style },
            position: new GuitarPosition(child.props.fret, child.props.string),
          };
        }
        throw new Error(`Fretboard children must be one of: ${Position.displayName}, got ${child}`);
      }) || []
    );
  }, [children]);

  useEffect(() => {
    fretboard.setDots(
      styleTargets.map<PositionFilterParams>((styleTarget) => ({
        fret: styleTarget.position.fret,
        string: styleTarget.position.string,
        note: guitar.getPitchAt(styleTarget.position).toString(),
      }))
    );

    fretboard.render();

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
    const styleFilters: PositionStyleFilter[] = uniqueStyles.map((uniqueStyle) => {
      return {
        predicate: (params: PositionFilterParams) => {
          const position = encodePosition(new GuitarPosition(params.fret, params.string));
          const style = encodeStyle(uniqueStyle);
          return style in positionsByStyle && positionsByStyle[style].has(position);
        },
        style: uniqueStyle,
      };
    });

    styleFilters.forEach((styleFilter) => {
      fretboard.style({ filter: styleFilter.predicate, ...styleFilter.style });
    });
  }, [fretboard, guitar, styleTargets]);

  return <figure id={id} />;
};

Fretboard.Position = Position;
