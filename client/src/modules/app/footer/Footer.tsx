import * as React from 'react';
import styled from 'react-emotion';
import { Layout, Row, Col } from 'antd';
import { Links } from './Links';
import { Copyright } from './Copyright';

const Outer = styled(Layout.Footer)`
  background: ${props => props.theme['@background-color-base']};
`;

const Inner = styled('div')`
  max-width: 1200px;
  margin: 0 auto;
`;

export const Footer = () => (
  <Outer>
    <Inner>
      <Row type="flex" justify="space-between">
        <Col>
          <Links />
        </Col>
        <Col>
          <Copyright />
        </Col>
      </Row>
    </Inner>
  </Outer>
);
