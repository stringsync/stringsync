import React from 'react';
import { compose, setPropTypes } from 'recompose';
import PropTypes from 'prop-types';

const enhance = compose(
  setPropTypes({
    numFrets: PropTypes.number
  })
);

const Frets = enhance(props => (
  <div>
    Frets
  </div>
));

export default Frets;
