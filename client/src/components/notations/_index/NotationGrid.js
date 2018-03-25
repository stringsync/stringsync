import React from 'react';
import PropTypes from 'prop-types';
import { NotationDetail } from './';
import { Row, Col } from 'antd';
import { chunk } from 'lodash';
import { compose, setDisplayName, setPropTypes, withProps } from 'recompose';
import { connect } from 'react-redux';
import styled from 'react-emotion';

const enhance = compose(
  connect(
    state => ({
      viewportType: state.viewport.type
    })
  ),
  setDisplayName('NotationGrid'),
  setPropTypes({
    notations: PropTypes.arrayOf(PropTypes.object)
  }),
  withProps(props => {
    let notationsPerRow, gutter;
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
        gutter = 24;
        break;
    }

    return {
      gutter,
      notationRows: chunk(props.notations, notationsPerRow),
      colSpan: Math.floor(24 / notationsPerRow),
    }
  })
);

const StyledRow = styled(Row)`
  margin-bottom: ${props => props.gutter}px;
`;

const Outer = styled('div')`
  margin-top: 24px;
  margin-left: ${props => props.viewportType === 'TABLET' ? props.gutter : 0}px;
  margin-right: ${props => props.viewportType === 'TABLET' ? props.gutter : 0}px;
`;

const NotationGrid = enhance(props => (
  <Outer viewportType={props.viewportType} gutter={props.gutter}>
    {
      props.notationRows.map((notationRow, ndx) => (
        <StyledRow key={ndx} gutter={props.gutter} type="flex" align="start">
          {
            notationRow.map(notation => (
              <Col key={notation.id} span={props.colSpan}>
                <NotationDetail notation={notation} />
              </Col>
            ))
          }
        </StyledRow>
      ))
    }
  </Outer>
));

export default NotationGrid;
