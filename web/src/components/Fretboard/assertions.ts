import React from 'react';
import { Position } from './Position';

export const isPositionComponent = (child: any): child is React.ReactElement<React.ComponentProps<typeof Position>> => {
  return React.isValidElement(child) && child.type === Position;
};
