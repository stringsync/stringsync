import * as React from 'react';
import { compose } from 'redux';
import { branch, renderNothing } from 'recompose';
import styled from 'react-emotion';
import { times } from 'lodash';

interface IProps {
  dots: number;
}

const enhance = compose(
  branch<IProps>(
    props => props.dots === 0,
    renderNothing
  )
);

const Outer = styled('div')`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
`;

const Dot = styled('div')`
  width: 14px;
  height: 14px;
  background-color: #6e6e6e;
  border-radius: 50%;
  opacity: 0.6;
`;

export const Dots = enhance(props => (
  <Outer className="fretboard-height">
    {times(props.dots, ndx => <Dot key={`fretboard-dot-${ndx}`} />)}
  </Outer>
));
