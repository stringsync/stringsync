import * as React from 'react';
import { Menu } from 'antd';
import { MENU_PROPS } from './MENU_PROPS';
import { ITEM_PROPS } from './ITEM_PROPS';
import { Link } from 'react-router-dom';
import { Avatar } from '../../../../components/avatar';
import { ISession } from '../../../../@types/session';
import { SUB_MENU_PROPS } from './SUB_MENU_PROPS';
import { compose, withHandlers } from 'recompose';
import { ClickParam } from 'antd/lib/menu';
import { withAuth, IWithAuthProps } from '../../../../enhancers/withAuth';

interface IOuterProps {
  session: ISession;
}

interface IInnerProps extends IOuterProps {
  handleMenuClick: (e: ClickParam) => void;
}

const enhance = compose<IInnerProps, IOuterProps>(
  withAuth,
  withHandlers<IOuterProps & IWithAuthProps, any>({
    handleMenuClick: props => ({ key }) => {
      if (key === 'sign-out') {
        props.signOut();
      }
    }
  })
);

export const StudentMenu = enhance(props => {
  const { image, name } = props.session;

  return (
    <Menu
      {...MENU_PROPS}
      onClick={props.handleMenuClick}
    >
      <Menu.SubMenu
        {...SUB_MENU_PROPS}
        title={<Avatar src={image} name={name} />}
      >
        <Menu.ItemGroup title={name}>
          <Menu.Item key="sign-out" {...ITEM_PROPS}>
            sign out
          </Menu.Item>
        </Menu.ItemGroup>
      </Menu.SubMenu>
    </Menu>
  );
});
