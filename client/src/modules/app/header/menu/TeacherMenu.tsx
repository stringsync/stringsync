import * as React from 'react';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';
import { MENU_PROPS } from './MENU_PROPS';
import { ITEM_PROPS } from './ITEM_PROPS';

export const TeacherMenu = () => (
  <Menu {...MENU_PROPS} >
    <Menu.Item {...ITEM_PROPS}>
      <Link to="/login">TEACHER</Link>
    </Menu.Item>
  </Menu>
);
