import React from 'react';
import styled from 'react-emotion';

const Outer = styled('div')`
  position: relative;
  z-index: 11;
  color: white;
`;

const Inner = styled('div')`
  width: 14px;
  height: 54px;
  left: -7px;
  top: 1px;
  border-left: 1px solid black;
  border-right: 1px solid black;
  border-bottom: 1px solid black;
  transition: background ease-in 100ms;
  background: black;
  position: absolute;
  box-sizing: border-box;
`;

const BlackPianoKey = props => (
  <Outer>
    <Inner/>
  </Outer>
);

export default BlackPianoKey;
