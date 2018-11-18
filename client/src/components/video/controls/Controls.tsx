import * as React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { NotationMenuActions } from '../../../data/notation-menu/notationMenuActions';
import { Row, Col, Slider, Icon } from 'antd';
import { Lane } from '../../lane';
import styled from 'react-emotion';

interface IDispatchProps {
  toggleVisibility: () => void;
}

const enhance = compose<IDispatchProps, {}>(
  connect(
    null,
    dispatch => ({
      toggleVisibility: () => dispatch(NotationMenuActions.toggleVisibility())
    })
  )
);

const Outer = styled('div')`
  padding: 12px 0 24px 0;
`;

export const Controls = enhance(() => (
  <Outer>
    <Lane>
      <Row type="flex" justify="center" align="middle">
        <Col span={1}>
          <Row type="flex" justify="center" align="middle">
            <Icon type="play-circle" style={{ fontSize: 24 }} />
          </Row>
        </Col>
        <Col span={16}>
          <Slider />
        </Col>
        <Col span={1}>
          <Row type="flex" justify="center" align="middle">
            <Icon type="setting" style={{ fontSize: 24 }} />
          </Row>
        </Col>
        <Col span={6}>
          <Row type="flex" justify="start" align="middle">
            Detail
        </Row>
        </Col>
      </Row>
    </Lane>
  </Outer>
));
