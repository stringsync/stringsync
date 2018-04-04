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

const enhance = compose<ViewportSyncProps, {}>(
  withSizes((size: Size) => ({
    queriedWidth: size.width
  }))
);

const ViewportSync = enhance(createSink((props: ViewportSyncProps) => {
  if (props.storedWidth !== props.queriedWidth) {
    props.setViewportWidth(props.queriedWidth);
  }
}));

export default ViewportSync;
