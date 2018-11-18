import * as React from 'react';
import { compose } from 'recompose';
import { Drawer } from 'antd';
import { connect } from 'react-redux';
import { IStore } from '../../../../@types/store';
import { NotationMenuActions } from '../../../../data/notation-menu/notationMenuActions';

interface IStateProps {
  visible: boolean;
}

interface IDispatchProps {
  hide: () => void;
}

type ConnectProps = IStateProps & IDispatchProps;

const enhance = compose<ConnectProps, {}>(
  connect<IStateProps, IDispatchProps, {}, IStore>(
    state => ({
      visible: state.notationMenu.visible
    }),
    dispatch => ({
      hide: () => dispatch(NotationMenuActions.hide())
    })
  )
);

export const Menu = enhance(props => (
  <Drawer
    title="Foo Bar"
    placement="right"
    closable={false}
    onClose={props.hide}
    visible={props.visible}
  >
    <p>foo</p>
    <p>bar</p>
  </Drawer>
));
