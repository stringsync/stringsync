import React from 'react';
import styled from 'react-emotion';
import { compose, setPropTypes } from 'recompose';
import PropTypes from 'prop-types';

const enhance = compose(
  setPropTypes({
    guitarString: PropTypes.number.isRequired,
    viewportType: PropTypes.string.isRequired,
    height: PropTypes.number.isRequired
  })
);

const Outer = styled('div')`
  width: 100%;
  height: ${props => props.height}px;
  background: #aaa;
  box-shadow: 0 0 0.5px 0.5px #222;
  opacity: ${props => props.viewportType === 'MOBILE' ? 0.6 : 0.8};
`;

const GuitarString = enhance(props => (
  <Outer
    height={props.height}
    viewportType={props.viewportType}
  />
));

export default GuitarString;
