import * as React from 'react';
import { compose, withState, lifecycle } from 'recompose';
import { Note } from 'models/music';
import { ViewportTypes } from 'data/viewport/getViewportType';
import styled from 'react-emotion';
import { sample } from 'lodash';

export type FretMarkerStates = 'LIT' | 'PRESSED' | 'HIDDEN' | 'JUST_PRESSED' | 'SUGGESTED';

interface IOuterProps {
  note: Note;
  viewportType: ViewportTypes;
}

interface IInnerProps extends IOuterProps {
  markerState: FretMarkerStates;
  setMarkerState: (markerState: FretMarkerStates) => void;
}

const getRandomState = (): FretMarkerStates => sample(['LIT', 'PRESSED', 'HIDDEN', 'JUST_PRESSED', 'SUGGESTED']) as FretMarkerStates;

const enhance = compose<IInnerProps, IOuterProps>(
  withState('markerState', 'setMarkerState', 'HIDDEN'),
  lifecycle<IInnerProps, {}>({
    componentDidMount(): void {
      this.props.setMarkerState(getRandomState());
    }
  })
);

interface IOuterDivProps {
  markerState: FretMarkerStates;
  viewportType: ViewportTypes;
}

const Outer = styled('div')<IOuterDivProps>(props => {
  // Base styles
  const base = {
    alignItems: 'center',
    borderRadius: '50%',
    boxSizing: 'border-box',
    display: 'flex',
    justifyContent: 'center',
    transition: 'all 200ms ease-in'
  };

  // font
  let font;
  switch (props.viewportType) {
    case 'MOBILE':
      font = {
        fontSize: 0,
      };
      break

    case 'TABLET':
      font = {
        fontSize: 10,
      };
      break

    case 'DESKTOP':
      font = {
        fontSize: 12,
        fontWeight: 700
      };
      break

    default:
      font = { };
      break
  }

  // Compute dimensions
  let size; // px
  switch (props.viewportType) {
    case 'MOBILE':
      size = 13;
      break

    case 'TABLET':
      size = 17;
      break

    case 'DESKTOP':
      size = 23;
      break

    default:
      size = 13;
      break
  }
  const dimensions = { width: size, height: size };

  // Compute styles based on the markerState
  let rest; // rest of styles
  switch(props.markerState) {
    case 'HIDDEN':
      rest = {
        opacity: 0
      };
      break;

    case 'JUST_PRESSED':
      rest = {
        backgroundColor: '#B3FB66',
        border: '2px solid rgba(0, 0, 0, 0.75)',
        opacity: 1
      };
      break;

    case 'PRESSED':
      rest = {
        backgroundColor: '#B3FB66',
        opacity: 1
      }
      break;

    case 'LIT':
      rest = {
        backgroundColor: 'rgb(251, 246, 102)',
        boxShadow: '0 0 2px 1px rgb(251, 246, 102)',
        opacity: 0.25
      };
      break

    case 'SUGGESTED':
      rest = {
        backgroundColor: 'fuchsia',
        opacity: 0.5
      };
      break

    default:
      rest = {};
      break;
  }

  
  return Object.assign(base, font, dimensions, rest);
});

export const FretMarker = enhance(props => (
  <Outer markerState={props.markerState} viewportType={props.viewportType}>
    {props.note.literal}
  </Outer>
));
