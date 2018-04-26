import React from 'react';
import styled from 'react-emotion';
import { compose, setPropTypes } from 'recompose';
import PropTypes from 'prop-types';

const enhance = compose(
  setPropTypes({
    fret: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    dots: PropTypes.number.isRequired,
    viewportType: PropTypes.string.isRequired
  })
);

const Outer = styled('div')`
  width: ${props => `${props.width}%`};
  border-right: ${props => props.fret === 0 ? 4 : props.viewportType === 'MOBILE' ? 1 : 2}px solid #aaa;
  box-shadow: 0 1px 1px 1px #222;
`;

const Fret = enhance(props => (
  <Outer
    fret={props.fret}
    width={props.width}
    className="fretboard-height"
  >
    {props.fret}
  </Outer>
));

export default Fret;
