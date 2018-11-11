import * as React from 'react';
import styled from 'react-emotion';
import { Title } from './Title';

interface IProps {
  block?: boolean;
  title?: string;
  width?: number | string;
}

const Outer = styled('div')<{ block?: boolean, width?: number }>`
  padding: 24px;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  background: white;
  display: ${props => props.block ? 'block' : 'inline-block'};
`;

export const Box = props => (
  <Outer block={props.block} width={props.width} style={{ width: props.width }}>
    <Title title={props.title} />
    {props.children}
  </Outer>
);
