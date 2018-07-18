import * as React from 'react';
import styled from 'react-emotion';
import { PianoKeyStates } from 'models/piano';

interface IProps {
  note: string;
  keyState: PianoKeyStates;
}

const Outer = styled('div')`
  z-index: 10;
  color: white;

  &:last-child {
    border-right: 1px solid black;
  }
`;

interface IInnerDivProps {
  keyState: PianoKeyStates;
}

const Inner = styled('div')<IInnerDivProps>(props => {
  const base = {
    alignItems: 'flex-end',
    borderBottom: '1px solid black',
    borderLeft: '1px solid black',
    borderTop: '1px solid black',
    display: 'flex',
    height: '98px',
    justifyContent: 'center',
    width: '24px'
  }

  let rest;
  switch(props.keyState) {
    case 'HIDDEN':
      rest = {
        background: 'white',
        transition: 'all 200ms ease-in'
      };
      break;

    case 'PRESSED':
      rest = {
        background: props.theme.primaryColor,
        transform: 'translateY(2px)'
      };
      break;

    default:
      rest = {
        background: 'white'
      };
      break;
  }

  return Object.assign(base, rest);
});

const MiddleC = styled('div')`
  margin-bottom: 3px;
  font-size: 10px;
  color: black;
`;

export const WhitePianoKey: React.SFC<IProps> = props => (
  <Outer>
    <Inner keyState={props.keyState}>
      {props.note === 'C/4' ? <MiddleC>C</MiddleC> : null}
    </Inner>
  </Outer>
);
