import React from 'react';
import PropTypes from 'prop-types';
import styled from 'react-emotion';
import { ScoreLine } from './';
import { compose, setPropTypes } from 'recompose';
import { Vextab } from 'models';

const enhance = compose(
  setPropTypes({
    vextab: PropTypes.instanceOf(Vextab)
  })
);

const Score = enhance(props => (
  <div>
    {props.vextab.lines.map((line, ndx) => <ScoreLine key={`score-line-${ndx}`} line={line} />)}
  </div>
));

export default Score;
