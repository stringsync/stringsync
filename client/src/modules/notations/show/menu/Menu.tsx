import * as React from 'react';
import { compose, withHandlers } from 'recompose';
import { Drawer, Checkbox } from 'antd';
import { connect } from 'react-redux';
import { IStore } from '../../../../@types/store';
import { NotationMenuActions } from '../../../../data/notation-menu/notationMenuActions';
import styled from 'react-emotion';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';

interface IStateProps {
  visible: boolean;
  fretboardVisible: boolean;
}

interface IDispatchProps {
  hide: () => void;
  setFretboardVisibility: (fretboardVisible: boolean) => void;
}

type ConnectProps = IStateProps & IDispatchProps;

interface IHandlerProps {
  handleFretboardVisibilityChange: (event: CheckboxChangeEvent) => void;
}

type InnerProps = ConnectProps & IHandlerProps;

const enhance = compose<InnerProps, {}>(
  connect<IStateProps, IDispatchProps, {}, IStore>(
    state => ({
      visible: state.notationMenu.visible,
      fretboardVisible: state.notationMenu.fretboardVisible
    }),
    dispatch => ({
      hide: () => dispatch(NotationMenuActions.hide()),
      setFretboardVisibility: (fretboardVisibility: boolean) => {
        dispatch(NotationMenuActions.setFretboardVisibility(fretboardVisibility));
      }
    })
  ),
  withHandlers<ConnectProps, IHandlerProps>({
    handleFretboardVisibilityChange: props => event => {
      props.setFretboardVisibility(event.target.checked);
    }
  })
);

const MenuItem = styled('li')`
  margin-top: 8px;
  padding: 16px;
  cursor: pointer;
`;

export const Menu = enhance(props => (
  <Drawer
    title="settings"
    placement="right"
    onClose={props.hide}
    visible={props.visible}
  >
    <ul>
      <MenuItem>
        <Checkbox
          defaultChecked={true}
          checked={props.fretboardVisible}
          onChange={props.handleFretboardVisibilityChange}
        >
          fretboard
        </Checkbox>
      </MenuItem>
    </ul>
  </Drawer>
));
