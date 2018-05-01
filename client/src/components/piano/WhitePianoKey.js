import React from 'react';
import styled from 'react-emotion';

const Outer = styled('div') `
  z-index: 10;
  color: white;

  &:last-child {
    border-right: 1px solid black;
  }
`;

const Inner = styled('div') `
  width: 24px;
  height: 98px;
  box-sizing: border-box;
  border-top: 1px solid black;
  border-left: 1px solid black;
  border-bottom: 1px solid black;
  transition: background ease-in 100ms;
  background: white;
  display: flex;
  justify-content: center;
  align-items: flex-end;
`;

const MiddleC = styled('div')`
  margin-bottom: 3px;
  font-size: 10px;
`;

const WhitePianoKey = props => (
  <Outer>
    <Inner>
      {props.note === 'C/4' ? <MiddleC>C</MiddleC> : null}
    </Inner>
  </Outer>
);

export default WhitePianoKey;
