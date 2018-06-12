import React from 'react';
import { compose, setPropTypes } from 'recompose';
import { Icon } from 'antd';
import PropTypes from 'prop-types';
import styled from 'react-emotion';

const enhance = compose(
  setPropTypes({
    menuCollapsed: PropTypes.bool.isRequired,
    onMenuClick: PropTypes.func.isRequired
  }),
);

/**
 * Workaround since applying the styles to the Icon component causes errors
 */
const Outer = styled('span')`
  i {
    transform: ${props => props.menuCollapsed ? 'rotate(0deg)' : 'rotate(180deg)'};
    transition: transform .2s ease-in;
  }
`;

const MenuToggle = enhance(props => (
  <Outer
    onClick={props.onMenuClick}
    menuCollapsed={props.menuCollapsed}
  >
    <Icon type="setting" />
  </Outer>
));

export default MenuToggle;
