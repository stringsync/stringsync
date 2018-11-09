import * as React from 'react';
import { Menu } from 'antd';
import { MENU_PROPS } from './MENU_PROPS';
import { ITEM_PROPS } from './ITEM_PROPS';
import { Link } from 'react-router-dom';
import { Avatar } from '../../../../components/avatar';
import { ISession } from '../../../../@types/session';
import { SUB_MENU_PROPS } from './SUB_MENU_PROPS';

interface IProps {
  session: ISession;
}

export const StudentMenu: React.SFC<IProps> = props => (
  <Menu {...MENU_PROPS} >
    <Menu.SubMenu
      {...SUB_MENU_PROPS}
      title={<Avatar src={props.session.image} name={props.session.name} />}
    >
      <Menu.ItemGroup title={props.session.role}>
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
