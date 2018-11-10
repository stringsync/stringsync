import * as React from 'react';
import { Menu, Avatar, Icon } from 'antd';
import { MENU_PROPS } from './MENU_PROPS';
import { ITEM_PROPS } from './ITEM_PROPS';
import { SUB_MENU_PROPS } from './SUB_MENU_PROPS';
import styled from 'react-emotion';

const GoogleIcon = styled('img')`
  width: 14px;
  margin-right: 4px;
`;

const OAuthItem = styled(Menu.Item)<{ background: string }>`
  background: ${props => props.background};
  color: #ffffff !important;
  padding: 16px;
  min-width: 200px;
`;

export const SignedOutMenu = () => (
  <Menu {...MENU_PROPS} >
    <Menu.SubMenu
      {...SUB_MENU_PROPS}
      title={<Avatar><Icon type="user" style={{ marginRight: 0 }} /></Avatar>}
    >
      <Menu.ItemGroup title="sign in">
        <OAuthItem key="google" {...ITEM_PROPS} background="#dd4b39">
          <Icon type="google" />
          google
        </OAuthItem>
        <OAuthItem key="facebook" {...ITEM_PROPS} background="#3f5692">
          <Icon type="facebook" />
          facebook
        </OAuthItem>
      </Menu.ItemGroup>
    </Menu.SubMenu>
  </Menu>
);
