import * as React from 'react';
import { Layout, Row, Col } from 'antd';
import { Links } from './Links';
import { Copyright } from './Copyright';
import { Lane } from '../../../components/lane';

export const Footer = () => (
  <Layout.Footer style={{ marginBottom: '64px' }}>
    <Lane withTopMargin={true}>
      <Row>
        <Col>
          <Links />
        </Col>
        <Col>
          <Copyright />
        </Col>
      </Row>
    </Lane>
  </Layout.Footer>
);
