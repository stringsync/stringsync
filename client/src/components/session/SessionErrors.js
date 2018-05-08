import React from 'react';
import { compose, setPropTypes } from 'recompose';
import PropTypes from 'prop-types';
import styled from 'react-emotion';
import { Alert } from 'antd';

const enhance = compose(
  setPropTypes({
    errors: PropTypes.arrayOf(PropTypes.string)
  })
);

const OuterErrors = styled('div')`
  text-align: center;
`;

const OuterSessionErrors = styled('div')`
  margin-top: 20px;
`;

const Errors = props => (
  <OuterErrors>
    {
      props.errors.map((error, ndx) => (
        <div key={`session-error-${ndx}`}>{error}</div>
      ))
    }
  </OuterErrors>
);

const SessionErrors = enhance(props => (
  props.errors.length === 0
    ? null
    : <OuterSessionErrors>
        <Alert
          type="error"
          message={<Errors errors={props.errors} />}
        />
      </OuterSessionErrors>
))

export default SessionErrors;
