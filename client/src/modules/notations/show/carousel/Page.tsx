import * as React from 'react';
import { INotation } from '../../../../@types/notation';
import { Row, Col } from 'antd';
import { Detail } from './Detail';

interface IProps {
  notations: INotation[];
}

export const Page: React.SFC<IProps> = props => (
  <Row type="flex" justify="center" gutter={8}>
    {props.notations.map((notation, ndx) => (
      <Col key={ndx}>
        <Detail notation={notation} />
      </Col>
    ))}
  </Row>
);
