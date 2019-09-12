import React from 'react';
import { Form, Input, Row, Col } from 'antd';
import styled from 'styled-components';

const StyledRow = styled(Row)`
  margin-top: 24px;
`;

interface Props {}

const Signup: React.FC<Props> = (props) => {
  return (
    <StyledRow type="flex" justify="center" align="middle">
      <Col xs={14} sm={14} md={12} lg={10} xl={8} xxl={6}>
        <Form>
          <Form.Item>
            <Input />
          </Form.Item>
          <Form.Item>
            <Input />
          </Form.Item>
        </Form>
      </Col>
    </StyledRow>
  );
};

export default Signup;
