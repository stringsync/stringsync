import React from 'react';
import { PlainPosition, PositionStyle } from './types';

type Props = {
  from: PlainPosition;
  to: PlainPosition;
  style?: Partial<PositionStyle>;
};

export const PullOff: React.FC<Props> = () => null;

PullOff.displayName = 'PullOff';
