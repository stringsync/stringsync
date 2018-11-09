import * as React from 'react';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';
import { MENU_PROPS } from './MENU_PROPS';
import { ITEM_PROPS } from './ITEM_PROPS';
import { SUB_MENU_PROPS } from './SUB_MENU_PROPS';
import { Avatar } from '../../../../components/avatar/Avatar';

export const TeacherMenu = props => {
  const { image, name } = props.session;

  return (
    <Menu {...MENU_PROPS} >
      <Menu.SubMenu
        {...SUB_MENU_PROPS}
        title={<Avatar src={image} name={name} />}
      >
        <Menu.ItemGroup title={name}>
          <Menu.Item {...ITEM_PROPS}>
            <Link to="/upload">upload</Link>
          </Menu.Item>
          <Menu.Item {...ITEM_PROPS}>
            <Link to="/logout">logout</Link>
          </Menu.Item>
        </Menu.ItemGroup>
      </Menu.SubMenu>
    </Menu>
  );
};
