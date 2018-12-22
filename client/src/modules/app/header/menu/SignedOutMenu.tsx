import * as React from 'react';
import { Menu, Avatar, Icon } from 'antd';
import { MENU_PROPS } from './MENU_PROPS';
import { ITEM_PROPS } from './ITEM_PROPS';
import { SUB_MENU_PROPS } from './SUB_MENU_PROPS';
import styled from 'react-emotion';
import { compose, withHandlers } from 'recompose';
import { ClickParam } from 'antd/lib/menu';
import { withAuth, IWithAuthProps } from '../../../../enhancers/withAuth';

interface IHandlerProps {
  handleMenuClick: (e: ClickParam) => void;
}

const enhance = compose <IHandlerProps & IWithAuthProps, {}>(
  withAuth,
  withHandlers<IWithAuthProps, IHandlerProps>({
    handleMenuClick: props => async ({ key }) => {
      // the key is the provider name
      await props.signIn(key);
    }
  })
);

const OAuthItem = styled(Menu.Item)<{ background: string }>`
  background: ${props => props.background};
  color: #ffffff !important;
  padding: 16px;
  min-width: 200px;
`;

export const SignedOutMenu = enhance(props => (
  <Menu
    {...MENU_PROPS}
    onClick={props.handleMenuClick}
  >
    <Menu.SubMenu
      {...SUB_MENU_PROPS}
      key="foo"
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
));
