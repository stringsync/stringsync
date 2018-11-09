import * as React from 'react';
import { INotation } from '../../../../@types/notation';
import { compose, withProps } from 'recompose';
import withSizes from 'react-sizes';
import { chunk } from 'lodash';
import { Row, Col } from 'antd';
import { Link } from 'react-router-dom';
import { Detail } from './Detail';
import styled from 'react-emotion';

interface IOuterProps {
  notations: INotation[];
}

interface ISizesProps extends IOuterProps {
  isMobile: boolean;
  isTablet: boolean;
}

interface IUiProps {
  notationRows: INotation[][];
  gutter: number;
  colSpan: number;
}

const enhance = compose<ISizesProps & IUiProps, IOuterProps>(
  withSizes(size => ({
    isMobile: withSizes.isMobile(size),
    isTablet: withSizes.isTablet(size)
  })),
  withProps<IUiProps, ISizesProps>(props => {
    let notationsPerRow: number;
    let gutter: number;

    if (props.isMobile) {
      notationsPerRow = 1;
      gutter = 8;
    } else if (props.isTablet) {
      notationsPerRow = 2;
      gutter = 16;
    } else {
      notationsPerRow = 3;
      gutter = 36;
    }

    return {
      colSpan: Math.floor(24 / notationsPerRow),
      gutter,
      notationRows: chunk(props.notations, notationsPerRow)
    };
  })
);

const Outer = styled('div')`
  margin: 0;
`;

export const Grid = enhance(props => (
  <Outer>
    {
      props.notationRows.map((notations, ndx) => (
        <Row
          key={ndx}
          gutter={props.gutter}
          type="flex"
          align="top"
          style={{ marginTop: props.gutter }}
        >
          {
            notations.map(notation => (
              <Col key={`col-${notation.id}`} span={props.colSpan}>
                <Link to={`/n/${notation.id}`}>
                  <Detail notation={notation} />
                </Link>
              </Col>
            ))
          }
        </Row>
      ))
    }
  </Outer>
));
