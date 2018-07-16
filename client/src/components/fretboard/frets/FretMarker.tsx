import * as React from 'react';
import { compose, withState } from 'recompose';
import { Note } from 'models/music';
import { ViewportTypes } from 'data/viewport/getViewportType';
import styled from 'react-emotion';
import { FretMarker as FretMarkerModel, FretMarkerStates } from 'models';

interface IOuterProps {
  note: Note;
  viewportType: ViewportTypes;
}

interface IInnerProps extends IOuterProps {
  markerState: FretMarkerStates;
  setMarkerState: (markerState: FretMarkerStates) => void;
}

const enhance = compose<IInnerProps, IOuterProps>(
  withState('markerState', 'setMarkerState', 'HIDDEN')
);

interface IOuterDivProps {
  markerState: FretMarkerStates;
  viewportType: ViewportTypes;
  note: Note;
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
        fontSize: 0
      };
      break

    case 'TABLET':
      font = {
        fontSize: 0
      };
      break

    case 'DESKTOP':
      font = {
        fontSize: 12,
        fontWeight: 700
      };
      break

    default:
      font = {
        fontSize: 0
      };
      break
  }
  if (!props.note.isNatural) {
    font.fontSize = Math.floor(font.fontSize * 0.75);
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
  <Outer
    note={props.note}
    markerState={props.markerState}
    viewportType={props.viewportType}
  >
    {props.note.literal}
  </Outer>
));
