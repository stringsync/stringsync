import React from 'react';
import { compose, setDisplayName, setPropTypes } from 'recompose';
import PropTypes from 'prop-types';

const enhance = compose(
  setDisplayName('NotationGrid'),
  setPropTypes({
    notations: PropTypes.arrayOf(PropTypes.object)
  })
);

const NotationGrid = enhance(props => (
  <div>
    {props.notations.map(notation => <img key={notation.id} src={notation.thumbnail} />)}
  </div>
));

export default NotationGrid;
