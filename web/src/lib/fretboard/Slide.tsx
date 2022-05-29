import React from 'react';
import { PlainPosition, PositionStyle } from './types';

type Props = {
  from: PlainPosition;
  to: PlainPosition;
  style?: Partial<PositionStyle>;
};

export const Slide: React.FC<Props> = () => null;

Slide.displayName = 'Slide';
