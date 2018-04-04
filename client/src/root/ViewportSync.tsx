import { compose, createSink } from 'recompose';
import { connect } from 'react-redux';
import withSizes from 'react-sizes';
import { viewportActions } from 'data';
import { RootState } from 'typings';

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
  })),
  connect(
    (state: RootState) => ({
      storedWidth: state.viewport.width
    }),
    dispatch => ({
      setViewportWidth: (width: number) => dispatch(viewportActions.setViewportWidth(width))
    })
  )
);

const ViewportSync = enhance(createSink((props: ViewportSyncProps) => {
  if (props.storedWidth !== props.queriedWidth) {
    props.setViewportWidth(props.queriedWidth);
  }
}));

export default ViewportSync;
