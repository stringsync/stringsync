import * as React from 'react';
import styled from 'react-emotion';
import { Alert } from 'antd';

interface IProps {
  errors: string[];
}

const OuterErrors = styled('div')`
  text-align: center;
`;

const OuterFormErrors = styled('div')`
  margin-top: 20px;
`;

const Errors = (props: IProps) => (
  <OuterErrors>
    {
      props.errors.map((error, ndx) => (
        <div key={`session-error-${ndx}`}>{error}</div>
      ))
    }
  </OuterErrors>
);

export const FormErrors = (props: IProps) => (
  props.errors.length === 0
    ? null
    : <OuterFormErrors>
      <Alert
        type="error"
        message={<Errors errors={props.errors} />}
      />
    </OuterFormErrors>
);
