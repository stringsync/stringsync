import * as React from 'react';
import styled from 'react-emotion';
import { ViewportTypes } from 'data/viewport/getViewportType';

interface IProps {
  guitarString: number;
  viewportType: ViewportTypes;
  height: number;
}

interface IOuterDivProps {
  height: number;
  viewportType: ViewportTypes;
}

const Outer = styled('div')<IOuterDivProps>`
  width: 100%;
  height: ${props => props.height}px;
  background: #aaa;
  box-shadow: 0 0 0.5px 0.5px #222;
  opacity: ${props => props.viewportType === 'MOBILE' ? 0.6 : 0.75};
`;

export const GuitarString: React.SFC<IProps> = props => (
  <Outer
    height={props.height}
    viewportType={props.viewportType}
  />
);
