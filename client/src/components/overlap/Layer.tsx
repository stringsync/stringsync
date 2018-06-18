import * as React from 'react';
import styled from 'react-emotion';

interface IProps {
  zIndex: number;
}

export const Layer = styled('div')<IProps>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: ${props => props.zIndex || 'inherit'};
`;
