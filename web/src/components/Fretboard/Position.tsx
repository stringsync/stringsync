import React from 'react';
import { PositionStyle } from './types';

type Props = {
  string: number;
  fret: number;
  style?: Partial<PositionStyle>;
};

export const Position: React.FC<Props> = () => {
  return null;
};

Position.displayName = 'Position';
