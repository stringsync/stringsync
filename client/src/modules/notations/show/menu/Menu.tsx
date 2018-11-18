import * as React from 'react';
import { compose } from 'recompose';
import { Drawer } from 'antd';

interface IConnectProps {
  visible: boolean | undefined;
  hide: () => void;
}

const enhance = compose<IConnectProps, {}>(

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
