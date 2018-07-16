import * as React from 'react';
import { compose, withState } from 'recompose';
import { Note } from 'models/music';
import { ViewportTypes } from 'data/viewport/getViewportType';
import styled from 'react-emotion';

export type FretMarkerStates = 'LIT' | 'PRESSED' | 'HIDDEN' | 'JUST_PRESSED' | 'SUGGESTED';

interface IOuterProps {
  note: Note;
  viewportType: ViewportTypes;
}

interface IInnerProps extends IOuterProps {
  markerState: FretMarkerStates;
  setMarkerState: (markerState: FretMarkerStates) => void;
}

const enhance = compose<IInnerProps, IOuterProps>(
  withState('markerState', 'setMarkerState', 'LIT')
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
    display: 'flex',
    justifyContent: 'center',
    transition: 'all 200ms ease-in'
  };

  // Compute dimensions
  const size = props.viewportType === 'MOBILE' ? 13 : 24;
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

  
  return Object.assign(base, dimensions, rest);
});

export const FretMarker = enhance(props => (
  <Outer markerState={props.markerState} viewportType={props.viewportType}>
    {props.note.literal}
  </Outer>
));
