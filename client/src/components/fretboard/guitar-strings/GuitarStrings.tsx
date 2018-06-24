import * as React from 'react';
import { GuitarString } from './GuitarString';
import { times } from 'lodash';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import styled from 'react-emotion';
import { ViewportTypes } from 'data/viewport/getViewportType';

interface IOuterProps {
  numStrings: number;
}

interface IInnerProps extends IOuterProps {
  viewportType: ViewportTypes;
}

// the first string corresponds to the high pitched e string
const STRING_HEIGHTS_PX = [1, 1, 1, 2, 2, 3]

const enhance = compose<IInnerProps, IOuterProps>(
  connect(
    (state: StringSync.Store.IState) => ({
      viewportType: state.viewport.type
    })
  )
);

const Outer = styled('div')`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  overflow-x: hidden;
  width: 100%;
`;

export const GuitarStrings = enhance(props => (
  <Outer className="fretboard-height">
    {
      times(props.numStrings, ndx => (
        <GuitarString
          key={`guitar-string-${ndx + 1}`}
          guitarString={ndx + 1}
          height={STRING_HEIGHTS_PX[ndx]}
          viewportType={props.viewportType}
        />
      ))
    }
  </Outer>
));
