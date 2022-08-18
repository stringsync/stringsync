import React from 'react';
import { PlainPosition, PositionStyle } from './types';

type Props = {
  from: PlainPosition;
  to: PlainPosition;
  style?: Partial<PositionStyle>;
};

export const HammerOn: React.FC<Props> = () => null;

HammerOn.displayName = 'HammerOn';
