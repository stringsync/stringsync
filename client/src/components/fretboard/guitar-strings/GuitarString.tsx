import * as React from 'react';
import styled from 'react-emotion';

interface IProps {
  height: number;
}

const Outer = styled('div')<{ height: number }>`
  width: 100%;
  height: ${props => props.height}px;
  background: #aaaaaa;
  box-shadow: 0 0 0.5px 0.5px #222222;
  opacity: 0.65;
`;

export const GuitarString: React.SFC<IProps> = props => <Outer height={props.height} />;
