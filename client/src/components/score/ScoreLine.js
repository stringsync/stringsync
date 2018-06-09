import React from 'react';
import { compose, setPropTypes, withHandlers, withState } from 'recompose';
import PropTypes from 'prop-types';
import { Line } from 'models';

const enhance = compose(
  setPropTypes({
    line: PropTypes.instanceOf(Line)
  }),
  withState('renderer', 'setRenderer', null),
  withHandlers({
    handleCanvasRef: props => canvas => {
      const { line } = props.line;
      props.vextab.renderer.assign(canvas, line.number);
    }
  })
);

const ScoreLine = props => (
  <div>
    <canvas ref={props.handleCanvasRef} />
  </div>
);

export default ScoreLine;
