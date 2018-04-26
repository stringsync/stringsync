import React from 'react';
import { compose, setPropTypes } from 'recompose';
import { Icon } from 'antd';
import PropTypes from 'prop-types';

const enhance = compose(
  setPropTypes({
    onMenuClick: PropTypes.func.isRequired
  }),
);

// TODO: make the settings gear spin

const MenuToggle = enhance(props => (
  <Icon type="setting" onClick={props.onMenuClick} />
));

export default MenuToggle;
