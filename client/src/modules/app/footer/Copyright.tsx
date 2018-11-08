import * as React from 'react';
import { Row, Col } from 'antd';
import styled from 'react-emotion';

const Muted = styled('span')`
  color: #aaaaaa;
  font-weight: 400;
`;

export const Copyright = () => (
  <Row type="flex" justify="center">
    <Col>
      <Muted>© 2018 stringsync</Muted>
    </Col>
  </Row>
);
