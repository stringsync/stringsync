import React from 'react';
import { compose, setPropTypes } from 'recompose';
import { Icon } from 'antd';
import PropTypes from 'prop-types';

const enhance = compose(
  setPropTypes({
    toggleMenuVisibility: PropTypes.func.isRequired
  }),
);

const MenuToggle = enhance(props => (
  <Icon type="setting" onClick={props.toggleMenuVisibility} />
));

export default MenuToggle;
