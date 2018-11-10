import * as React from 'react';
import { GridProps } from '../Grid';
import { times } from 'lodash';
import { Row, Col, Card, Skeleton, Avatar } from 'antd';
import styled from 'react-emotion';

const Cover = styled('div')`
  width: 100%;
  height: 375px;
  background: #f2f2f2;
`;

export const LoadingDetails = (props: GridProps) => (
  <div>
    {
      times(4, ndx => (
        <Row
          key={`notation-row-${ndx}`}
          gutter={props.gutter}
          type="flex"
          align="top"
          style={{ marginTop: props.gutter }}
        >
          {
            times(3, ndx2 => (
              <Col key={`col-${ndx}-${ndx2}`} span={props.colSpan}>
                <Card cover={<Cover />}>
                  <Skeleton
                    loading={true}
                    avatar={true}
                    title={true}
                    paragraph={true}
                  >
                    <Card.Meta
                      avatar={<Avatar icon="user" />}
                      title="artist"
                      description="song name | transcriber name"
                    />
                  </Skeleton>
                </Card>
              </Col>
            ))
          }
        </Row>
      ))
    }
  </div>
);
