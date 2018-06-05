import React from 'react';
import PropTypes from 'prop-types';
import styled from 'react-emotion';
import { Overlap, Layer } from 'components';
import { ScoreLine } from './';
import { chunk } from 'lodash';
import { compose, setPropTypes, withProps } from 'recompose';

const enhance = compose(
  setPropTypes({
    measures: PropTypes.array,
    measuresPerLine: PropTypes.number,
  }),
  withProps(props => ({
    lines: chunk(props.measures, props.measuresPerLine)
  }))
);

const Score = enhance(props => (
  <Overlap>
    {props.lines.map((line, ndx) => <ScoreLine key={`score-line-${ndx}`} line={line} />)}
  </Overlap>
));

export default Score;
