import * as React from 'react';
import styled from 'react-emotion';
import { Layout, Row, Col } from 'antd';
import { Links } from './Links';
import { Copyright } from './Copyright';

const Inner = styled('div')`
  max-width: 1200px;
  margin: 0 auto;
`;

export const Footer = () => (
  <Layout.Footer>
    <Inner>
      <Row>
        <Col>
          <Links />
        </Col>
        <Col>
          <Copyright />
        </Col>
      </Row>
    </Inner>
  </Layout.Footer>
);
