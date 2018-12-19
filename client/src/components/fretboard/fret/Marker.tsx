import * as React from 'react';
import { compose, withStateHandlers, StateHandler, withProps, lifecycle } from 'recompose';
import { Flow } from 'vextab/releases/vextab-div.js';
import styled from 'react-emotion';
import { Fretboard } from '../../../models/fretboard';

interface IProps {
  str: number;
  fret: number;
  fretboard: Fretboard;
}

type FretMarkerState = 'LIT' | 'PRESSED' | 'HIDDEN' | 'JUST_PRESSED';

interface IStateProps {
  markerState: FretMarkerState;
}

interface IHandlerProps {
  [light: string]: StateHandler<IStateProps>;
  unlight: StateHandler<IStateProps>;
  press: StateHandler<IStateProps>;
  unpress: StateHandler<IStateProps>;
  justPress: StateHandler<IStateProps>;
  justUnpress: StateHandler<IStateProps>;
}

type WithStateHandlerProps = IStateProps & IHandlerProps;

interface INoteProps {
  noteLiteral: string;
}

type InnerProps = IProps & WithStateHandlerProps & INoteProps;

const TUNING = new (Flow as any).Tuning();

const enhance = compose<InnerProps, IProps>(
  withStateHandlers<IStateProps, IHandlerProps, IProps>(
    { markerState: 'HIDDEN' },
    {
      light:       () => () => ({ markerState: 'LIT'          }),
      unlight:     () => () => ({ markerState: 'HIDDEN'       }),
      press:       () => () => ({ markerState: 'PRESSED'      }),
      unpress:     () => () => ({ markerState: 'LIT'          }),
      justPress:   () => () => ({ markerState: 'JUST_PRESSED' }),
      justUnpress: () => () => ({ markerState: 'PRESSED'      })
    }
  ),
  withProps<INoteProps, IProps & WithStateHandlerProps>(props => ({
    noteLiteral: TUNING.getNoteForFret(props.fret, props.str).split('/')[0]
  })),
  lifecycle<InnerProps, {}, {}>({
    componentDidMount(): void {
      this.props.fretboard.add(this, { fret: this.props.fret, str: this.props.str });
    },
    componentWillUnmount(): void {
      this.props.fretboard.remove({ fret: this.props.fret, str: this.props.str });
    }
  })
);

interface IOuterProps {
  state: FretMarkerState;
}

const opacity = (props: IOuterProps) => {
  switch (props.state) {
    case 'HIDDEN':
      return 0;
    case 'LIT':
      return 0.25;
    case 'PRESSED':
    case 'JUST_PRESSED':
      return 1;
    default:
      return 0;
  }
};

const background = (props: IOuterProps) => {
  switch (props.state) {
    case 'HIDDEN':
      return 'none';
    case 'LIT':
      return '#fbf666';
    case 'PRESSED':
    case 'JUST_PRESSED':
      return '#B3FB66';
    default:
      return 'none';
  }
};

const transform = (props: IOuterProps) => {
  switch (props.state) {
    case 'LIT':
    case 'JUST_PRESSED':
      return 'translateY(-2px)';
    default:
      return 'none';
  }
};

const boxShadow = (props: IOuterProps) => {
  switch (props.state) {
    case 'LIT':
    case 'JUST_PRESSED':
      return '0 3px #92cc55';
    case 'PRESSED':
      return '0 1px #92cc55';
    default:
      return 'none';
  }
};

const Outer = styled('div')<IOuterProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  box-sizing: border-box;
  font-size: 0.75em;
  font-weight: 700;
  width: 2em;
  height: 2em;
  z-index: 2;
  background: ${background};
  opacity: ${opacity};
  transform: ${transform};
  box-shadow: ${boxShadow};
  transition: all 50ms ease-in;
`;

export const Marker = enhance(props => <Outer state={props.markerState}>{props.noteLiteral}</Outer>);
