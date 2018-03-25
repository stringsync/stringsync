import React from 'react';
import { compose, setDisplayName, setPropTypes, withProps } from 'recompose';
import PropTypes from 'prop-types';
import { chunk } from 'lodash';
import styled from 'react-emotion';

const enhance = compose(
  setDisplayName('NotationGrid'),
  setPropTypes({
    notations: PropTypes.arrayOf(PropTypes.object)
  }),
  withProps(props => ({
    notationRows: chunk(props.notations, 3)
  }))
);

const GridRow = styled('div')`
`;

const GridItem = styled('div')`
  overflow: hidden;
  padding-bottom: 100%;
  
  img {
    width: 100%;
    height: 100%;
  }
`;

const NotationGrid = enhance(props => (
  <div>
    {
      props.notationRows.map((notationRow, ndx) => (
        <div key={ndx}>
          {
            notationRow.map(({ id, attributes }) => (
              <GridItem key={id}>
                <img src={attributes.thumbnail} alt={attributes.songName} />
              </GridItem>
            ))
          }
        </div>
      ))
    }
  </div>
));

export default NotationGrid;
