import React from 'react';
import { PositionStyle } from './types';

type Props = {
  string: number;
  fret: number;
  style?: Partial<PositionStyle>;
};

export const Position: React.FC<Props> = () => null;

Position.displayName = 'Position';
