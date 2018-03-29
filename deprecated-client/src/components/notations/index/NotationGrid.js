import React from 'react';
import PropTypes from 'prop-types';
import styled from 'react-emotion';
import { NotationDetail } from './';
import { Row, Col } from 'antd';
import { chunk } from 'lodash';
import { compose, setDisplayName, setPropTypes, withProps } from 'recompose';
import { connect } from 'react-redux';

const enhance = compose(
  setDisplayName('NotationGrid'),
  connect(
    state => ({
      viewportType: state.viewport.type
    })
  ),
  setPropTypes({
    notations: PropTypes.arrayOf(PropTypes.object),
    queryTags: PropTypes.object.isRequired
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
        gutter = 36;
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

/**
 * This component is the main content of the NotationIndex component
 */
const NotationGrid = enhance(props => (
  <Outer viewportType={props.viewportType} gutter={props.gutter}>
    {
      props.notationRows.map((notationRow, ndx) => (
        <StyledRow key={ndx} gutter={props.gutter} type="flex" align="start">
          {
            notationRow.map(notation => (
              <Col key={notation.id} span={props.colSpan}>
                <NotationDetail notation={notation} queryTags={props.queryTags} />
              </Col>
            ))
          }
        </StyledRow>
      ))
    }
  </Outer>
));

export default NotationGrid;
