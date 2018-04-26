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

const StyledIcon = styled(Icon)`
  transform: ${props => props.menuCollapsed ? 'rotate(0deg)' : 'rotate(180deg)'};
  transition: transform .2s ease-in;
`;

const MenuToggle = enhance(props => (
  <StyledIcon
    type="setting"
    onClick={props.onMenuClick}
    menuCollapsed={props.menuCollapsed}
  />
));

export default MenuToggle;
