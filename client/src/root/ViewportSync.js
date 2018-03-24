import React from 'react';
import { compose, createSink, setDisplayName } from 'recompose';
import { connect } from 'react-redux';
import withSizes from 'react-sizes';
import { viewportActions } from 'data';

const enhance = compose(
  withSizes(({ width }) => ({ reactSizesWidth: width })),
  setDisplayName('ViewportSync'),
  connect(
    state => ({
      storeWidth: state.viewport.width
    }),
    dispatch => ({
      setViewportWidth: width => dispatch(viewportActions.viewport.width.set(width))
    })
  )
);

const Sink = createSink(({ setViewportWidth, reactSizesWidth, storeWidth }) => {
  if (reactSizesWidth !== storeWidth) {
    setViewportWidth(reactSizesWidth);
  }
});

const ViewportSync = enhance(props => <Sink {...props} />);

export default ViewportSync;
