import * as React from 'react';
import { Menu } from 'antd';
import { MENU_PROPS } from './MENU_PROPS';
import { ITEM_PROPS } from './ITEM_PROPS';
import { Link } from 'react-router-dom';

export const AdminMenu = () => (
  <Menu {...MENU_PROPS} >
    <Menu.Item {...ITEM_PROPS}>
      <Link to="/login">ADMIN</Link>
    </Menu.Item>
  </Menu>
);
