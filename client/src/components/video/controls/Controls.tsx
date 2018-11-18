import * as React from 'react';
import { Row, Col } from 'antd';
import { Lane } from '../../lane';
import styled from 'react-emotion';
import { Settings } from './Settings';
import { Detail } from './Detail';
import { Play } from './Play';
import { Scrubber } from './Scrubber';

const Outer = styled('div')`
  padding: 12px 0;
`;

export const Controls = () => (
  <Outer>
    <Lane withPadding={true}>
      <Row type="flex" justify="center" align="middle" gutter={8}>
        <Col span={1}>
          <Play />
        </Col>
        <Col xxl={18} xl={18} lg={22} md={22} sm={22} xs={22}>
          <Scrubber />
        </Col>
        <Col span={1}>
          <Settings />
        </Col>
        <Col xxl={4} xl={4} lg={0} md={0} sm={0} xs={0}>
          <Detail />
        </Col>
      </Row>
    </Lane>
  </Outer>
);
