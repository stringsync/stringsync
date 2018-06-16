import * as React from 'react';
import { compose, createSink } from 'recompose';
import withSizes from 'react-sizes';
import { ViewportActions } from 'data/viewport';
import { connect } from 'react-redux';

export interface ISinkProps {
  reactSizesWidth: number;
  storeWidth: number;
  setViewportWidth: (width: number) => void;
}

const enhance = compose(
  (withSizes as any)(({ width }: { width: number }) => ({ reactSizesWidth: width })),
  connect(
    (state: StringSync.Store.IState) => ({
      storeWidth: state.viewport.width
    }),
    dispatch => ({
      setViewportWidth: (width: number) => dispatch(ViewportActions.setViewportWidth(width))
    })
  )
);

const Sink = createSink((props: ISinkProps) => {
  if (props.reactSizesWidth !== props.storeWidth) {
    props.setViewportWidth(props.reactSizesWidth);
  }
});

export const ViewportSync = enhance(props => <Sink {...props} />);
