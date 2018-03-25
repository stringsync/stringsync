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

/**
 * Only update the store if the width changed
 */
const Sink = createSink(({ setViewportWidth, reactSizesWidth, storeWidth }) => {
  if (reactSizesWidth !== storeWidth) {
    setViewportWidth(reactSizesWidth);
  }
});

/**
 * This component syncs the width from react-sizes's withSizes to the
 * store's viewport's width
 */
const ViewportSync = enhance(props => <Sink {...props} />);

export default ViewportSync;
