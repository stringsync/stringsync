import * as React from 'react';
import styled from 'react-emotion';
import { PianoKeyStates } from 'models/piano';

interface IProps {
  note: string;
  keyState: PianoKeyStates;
}

const Outer = styled('div')`
  position: relative;
  z-index: 11;
  color: white;
`;

interface IInnerDivProps {
  keyState: PianoKeyStates
}

const Inner = styled('div')<IInnerDivProps>(props => {
  const base = {
    alignItems: 'flex-end',
    border: '1px solid black',
    display: 'flex',
    height: '54px',
    justifyContent: 'center',
    left: '-7px',
    position: 'absolute',
    top: '1px',
    width: '14px'
  }

  let rest;
  switch (props.keyState) {
    case 'HIDDEN':
      rest = {
        background: 'black',
        transition: 'all 200ms ease-in'
      };
      break;

    case 'PRESSED':
      rest = {
        background: props.theme.primaryColor,
        height: '56px'
      };
      break;

    default:
      rest = {
        background: 'black'
      };
      break;
  }

  return Object.assign(base, rest);
});

export const BlackPianoKey: React.SFC<IProps> = props => (
  <Outer>
    <Inner keyState={props.keyState} />
  </Outer>
);
