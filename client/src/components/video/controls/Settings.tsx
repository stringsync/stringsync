import * as React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { IStore } from '../../../@types/store';
import { NotationMenuActions } from '../../../data/notation-menu/notationMenuActions';
import { Row, Icon } from 'antd';
import styled from 'react-emotion';
import { ICON_SIZE } from './ICON_SIZE';

interface IStateProps {
  visible: boolean;
}

interface IDispatchProps {
  toggleVisibility: () => void;
}

type ConnectProps = IStateProps & IDispatchProps;

const enhance = compose<ConnectProps, {}>(
  connect<IStateProps, IDispatchProps, {}, IStore>(
    state => ({
      visible: state.notationMenu.visible
    }),
    dispatch => ({
      toggleVisibility: () => dispatch(NotationMenuActions.toggleVisibility())
    })
  )
);

const Outer = styled('div')`
  cursor: pointer;
`;

const IconWrapper = styled('span')<{ menuVisible: boolean }>`
  i {
    transform: ${props => props.menuVisible ? 'rotate(0deg)' : 'rotate(180deg)'};
    transition: transform 300ms ease-in-out;
  }
`;

export const Settings = enhance(props => (
  <Outer onClick={props.toggleVisibility}>
    <Row
      type="flex"
      justify="center"
      align="middle"
    >
      <IconWrapper menuVisible={props.visible}>
        <Icon type="setting" style={{ fontSize: ICON_SIZE }} />
      </IconWrapper>
    </Row>
  </Outer>
));
