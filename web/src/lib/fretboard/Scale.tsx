import React from 'react';
import { PositionStyle } from './types';

type Props = {
  name: string;
  style?: Partial<PositionStyle>;
};

export const Scale: React.FC<Props> = () => null;

Scale.displayName = 'Scale';
