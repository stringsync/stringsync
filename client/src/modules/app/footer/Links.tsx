import * as React from 'react';
import { Row, Col } from 'antd';
import { Link } from 'react-router-dom';

export const Links = () => (
  <Row type="flex" justify="center" gutter={16}>
    <Col><Link to="/about">about</Link></Col>
    <Col><Link to="/teach">teach</Link></Col>
    <Col><Link to="/terms">terms</Link></Col>
    <Col><Link to="/contact">contact</Link></Col>
  </Row>
);
