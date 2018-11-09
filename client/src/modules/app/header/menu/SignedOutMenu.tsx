import * as React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Avatar, Icon } from 'antd';
import { MENU_PROPS } from './MENU_PROPS';
import { ITEM_PROPS } from './ITEM_PROPS';

export const SignedOutMenu = () => (
  <Menu {...MENU_PROPS} >
    <Menu.Item {...ITEM_PROPS}>
      <Link to="/login">
        <Avatar>
          <Icon type="user" style={{ marginRight: 0 }} />
        </Avatar>
      </Link>
    </Menu.Item>
  </Menu>
);
