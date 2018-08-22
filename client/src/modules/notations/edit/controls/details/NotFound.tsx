import * as React from 'react';
import { compose } from 'recompose';
import { Form, Alert } from 'antd';

const enhance = compose(

);

export const NotFound = enhance(() => (
  <Form.Item>
    <Alert message="no element found" /> 
  </Form.Item>
));
