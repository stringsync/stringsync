import * as React from 'react';
import { compose, withHandlers } from 'recompose';
import { Drawer, Checkbox } from 'antd';
import { connect } from 'react-redux';
import { IStore } from '../../../../@types/store';
import { NotationMenuActions } from '../../../../data/notation-menu/notationMenuActions';
import styled from 'react-emotion';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { ScoreActions } from '../../../../data/score/scoreActions';

interface IStateProps {
  visible: boolean;
  autoScroll: boolean;
  fretboardVisible: boolean;
}

interface IDispatchProps {
  hide: () => void;
  setAutoScroll: (autoScroll: boolean) => void;
  setFretboardVisibility: (fretboardVisible: boolean) => void;
}

type ConnectProps = IStateProps & IDispatchProps;

interface IHandlerProps {
  toggleAutoScroll: (event: CheckboxChangeEvent) => void;
  toggleFretboardVisibility: (event: CheckboxChangeEvent) => void;
}

type InnerProps = ConnectProps & IHandlerProps;

const enhance = compose<InnerProps, {}>(
  connect<IStateProps, IDispatchProps, {}, IStore>(
    state => ({
      visible: state.notationMenu.visible,
      autoScroll: state.score.autoScroll,
      fretboardVisible: state.notationMenu.fretboardVisible
    }),
    dispatch => ({
      hide: () => dispatch(NotationMenuActions.hide()),
      setAutoScroll: (autoScroll: boolean) => dispatch(ScoreActions.setAutoScroll(autoScroll)),
      setFretboardVisibility: (fretboardVisibility: boolean) => {
        dispatch(NotationMenuActions.setFretboardVisibility(fretboardVisibility));
      }
    })
  ),
  withHandlers<ConnectProps, IHandlerProps>({
    toggleAutoScroll: props => event => {
      props.setAutoScroll(event.target.checked);
    },
    toggleFretboardVisibility: props => event => {
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
          checked={props.fretboardVisible}
          onChange={props.toggleFretboardVisibility}
        >
          fretboard
        </Checkbox>
      </MenuItem>
      <MenuItem>
        <Checkbox
          checked={props.autoScroll}
          onChange={props.toggleAutoScroll}
        >
          autoscroll
        </Checkbox>
      </MenuItem>
    </ul>
  </Drawer>
));
