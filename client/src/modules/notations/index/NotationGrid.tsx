import * as React from 'react';
import styled from 'react-emotion';
import { NotationDetail } from './NotationDetail';
import { Row, Col } from 'antd';
import { chunk } from 'lodash';
import { compose, setDisplayName, setPropTypes, withProps } from 'recompose';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { ViewportTypes } from '../../../data/viewport/getViewportType';

interface IOuterProps {
  notations: Notation.INotation[];
  queryTags: Set<string>;
}

interface IInnerProps extends IOuterProps {
  viewportType: ViewportTypes;
  colSpan: number;
  gutter: number;
  notationRows: Notation.INotation[][]
}

const enhance = compose<IInnerProps, IOuterProps>(
  connect(
    (state: StringSync.Store.IState) => ({
      viewportType: state.viewport.type
    })
  ),
  withProps((props: any) => {
    let notationsPerRow;
    let gutter;
    switch (props.viewportType) {
      case 'MOBILE':
        notationsPerRow = 1;
        gutter = 2;
        break;
      case 'TABLET':
        notationsPerRow = 2;
        gutter = 16;
        break;
      default:
        notationsPerRow = 3;
        gutter = 36;
        break;
    }

    return {
      colSpan: Math.floor(24 / notationsPerRow),
      gutter,
      notationRows: chunk(props.notations, notationsPerRow)
    }
  })
);

interface IStyledRowProps {
  gutter: number;
}

const StyledRow = styled(Row)<IStyledRowProps>`
  margin-bottom: ${props => props.gutter}px;
`;

interface IOuterDivProps {
  gutter: number;
  viewportType: ViewportTypes;
}

const Outer = styled('div')<IOuterDivProps>`
  margin-top: 24px;
  margin-left: ${props => props.viewportType === 'TABLET' ? props.gutter : 0}px;
  margin-right: ${props => props.viewportType === 'TABLET' ? props.gutter : 0}px;
`;

/**
 * This component is the main content of the NotationIndex component
 */
export const NotationGrid = enhance(props => (
  <Outer viewportType={props.viewportType} gutter={props.gutter}>
    {
      props.notationRows.map((notationRow, ndx) => (
        <StyledRow key={ndx} gutter={props.gutter} type="flex" align="top">
          {
            notationRow.map(notation => (
              <Col key={`col-${notation.id}`} span={props.colSpan}>
                <Link to={`/n/${notation.id}`}>
                  <NotationDetail notation={notation} queryTags={props.queryTags} />
                </Link>
              </Col>
            ))
          }
        </StyledRow>
      ))
    }
  </Outer>
));

export default NotationGrid;
