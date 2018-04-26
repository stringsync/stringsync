import React from 'react';
import styled from 'react-emotion';
import { Menu, Radio, Checkbox, Icon } from 'antd';
import { withRouter, Link } from 'react-router-dom';
import { compose, withHandlers, withState, setPropTypes } from 'recompose';
import PropTypes from 'prop-types';

const { SubMenu, ItemGroup, Item } = Menu;
const RadioGroup = Radio.Group;

const enhance = compose(
  setPropTypes({
    collapsed: PropTypes.bool.isRequired
  }),
  withRouter
);


const Outer = styled('div')`
  position: fixed;
  max-width: ${props => props.collapsed ? '0' : '350px'};
  min-height: 100vh;
  background: white;
  top: 0;
  right: 0;
`;

const NotationShowMenu = enhance(props => (
  <Outer collapsed={props.collapsed}>
    <Menu
      selectable={false}
      defaultSelectedKeys={[]}
      defaultOpenKeys={[]}
      mode="inline"
      inlineCollapsed={props.collapsed}
    >
      <Item key="1">
        <Icon type="pie-chart" />
        <span>Option 1</span>
      </Item>
      <Item key="2">
        <Icon type="desktop" />
        <span>Option 2</span>
      </Item>
      <Item key="3">
        <Icon type="inbox" />
        <span>Option 3</span>
      </Item>
      <SubMenu key="sub1" title={<span><Icon type="mail" /><span>Navigation One</span></span>}>
        <Item key="5">Option 5</Item>
        <Item key="6">Option 6</Item>
        <Item key="7">Option 7</Item>
        <Item key="8">Option 8</Item>
      </SubMenu>
      <SubMenu key="sub2" title={<span><Icon type="appstore" /><span>Navigation Two</span></span>}>
        <Item key="9">Option 9</Item>
        <Item key="10">Option 10</Item>
        <SubMenu key="sub3" title="Submenu">
          <Item key="11">Option 11</Item>
          <Item key="12">Option 12</Item>
        </SubMenu>
      </SubMenu>
    </Menu>
  </Outer>
));

export default NotationShowMenu;
