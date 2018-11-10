import * as React from 'react';
import { GridProps } from '../Grid';
import { Row, Col } from 'antd';
import { Link } from 'react-router-dom';
import { Detail } from './Detail';

export const LoadedDetails = (props: GridProps) => (
  <div>
    {
      props.notationRows.map((notations, ndx) => (
        <Row
          key={`notation-row-${ndx}`}
          gutter={props.gutter}
          type="flex"
          align="top"
          style={{ marginTop: props.gutter }}
        >
          {
            notations.map(notation => (
              <Col key={`col-${notation.id}`} span={props.colSpan}>
                <Link to={`/n/${notation.id}`}>
                  <Detail
                    notation={notation}
                    checkedTags={props.queryTags}
                  />
                </Link>
              </Col>
            ))
          }
        </Row>
      ))
    }
  </div>
);
