import React from 'react';
import { compose, setPropTypes } from 'recompose';
import PropTypes from 'prop-types';
import styled from 'react-emotion';

const enhance = compose(
  setPropTypes({
    errors: PropTypes.arrayOf(PropTypes.string)
  })
);

const StyledList = styled('ul')`
  list-style: disc outside none;
  margin-left: 20px;
`;

const SessionErrors = enhance(props => (
  <StyledList>
    {
      props.errors.map((error, ndx) => (
        <li key={`session-error-${ndx}`}>{error}</li>
      ))
    }
  </StyledList>
));

export default SessionErrors;
