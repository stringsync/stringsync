import * as React from 'react';
import styled from 'react-emotion';
import { Layout, Row, Col } from 'antd';
import { Branding } from './Branding';
import { Link } from 'react-router-dom';
import { Menu } from './menu';

const Outer = styled(Layout.Header)`
  background: #ffffff;
  border-bottom: 1px solid #e8e8e8;
`;

const Inner = styled('div')`
  max-width: 1200px;
  margin: 0 auto;
`;

export const Header = () => (
  <Outer>
    <Inner>
      <Row type="flex" justify="space-between">
        <Col>
          <Link to="/"><Branding /></Link>
        </Col>
        <Col>
          <Menu />
        </Col>
      </Row>
    </Inner>
  </Outer>
);
