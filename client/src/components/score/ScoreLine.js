import React from 'react';
import { compose, setPropTypes, withHandlers, withState } from 'recompose';
import PropTypes from 'prop-types';
import { Line } from 'models';

const enhance = compose(
  setPropTypes({
    line: PropTypes.instanceOf(Line)
  }),
  withState('renderer', 'setRenderer', null),
  withHandlers(() => {
    let canvas = null;

    return {
      handleCanvasRef: () => ref => {
        canvas = ref;
      }
    };
  })
);

const ScoreLine = props => (
  <div>
    <canvas ref={props.handleCanvasRef} />
  </div>
);

export default ScoreLine;
