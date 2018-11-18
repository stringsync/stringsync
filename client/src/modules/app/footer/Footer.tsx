import * as React from 'react';
import styled from 'react-emotion';
import { Layout, Row, Col } from 'antd';
import { Links } from './Links';
import { Copyright } from './Copyright';
import { Lane } from '../../../components/lane';

const Inner = styled('div')`
  margin-bottom: 90px;
`;

export const Footer = () => (
  <Layout.Footer>
    <Lane withTopMargin={true}>
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
    </Lane>
  </Layout.Footer>
);
