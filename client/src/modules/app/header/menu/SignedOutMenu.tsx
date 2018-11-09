import * as React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Icon } from 'antd';
import { MENU_PROPS } from './MENU_PROPS';
import { ITEM_PROPS } from './ITEM_PROPS';

export const SignedOutMenu = () => (
  <Menu {...MENU_PROPS} >
    <Menu.Item {...ITEM_PROPS}>
      <Link to="/login"><Icon type="user" /></Link>
    </Menu.Item>
  </Menu>
);
