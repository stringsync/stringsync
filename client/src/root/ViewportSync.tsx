import * as React from 'react';
import { compose, createSink } from 'recompose';
import { connect } from 'react-redux';
import withSizes from 'react-sizes';

interface ViewportSyncProps {
  queriedWidth: number;
  storedWidth: number;
  setViewportWidth: (width: number) => void;
}

interface Size {
  width: number;
  height: number;
}

const enhance = compose(
  withSizes((size: Size) => ({
    queriedWidth: size.width
  })),
  createSink((props: ViewportSyncProps) => {
    if (props.storedWidth !== props.queriedWidth) {
      props.setViewportWidth(props.queriedWidth);
    }
  })
);

const ViewportSync = enhance(() => null);

export default ViewportSync;
