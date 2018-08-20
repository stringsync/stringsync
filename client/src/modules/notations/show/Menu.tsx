import * as React from 'react';
import styled from 'react-emotion';
import { Menu as AntdMenu, Checkbox, Icon } from 'antd';
import { withRouter, Link, RouteComponentProps } from 'react-router-dom';
import { compose, withState, withHandlers } from 'recompose';
import { connect, Dispatch } from 'react-redux';
import { get } from 'lodash';
import { UiActions } from 'data';

const { ItemGroup, Item } = AntdMenu;

type WithRouterProps = RouteComponentProps<{ id: string }>

interface IConnectProps extends WithRouterProps {
  isCurrentUserTranscriber: boolean;
  role: Role.Roles;
  isLoopVisible: boolean;
  isNotationMenuVisible: boolean;
  isFretboardVisible: boolean;
  isPianoVisible: boolean;
  setFretboardVisibility: (visibility: boolean) => void;
  setLoopVisibility: (visibility: boolean) => void;
  setPianoVisibility: (visibility: boolean) => void;
  setNotationMenuVisibility: (visibility: boolean) => void;
}

interface IHandlerProps extends IConnectProps {
  handleFretboardChange: () => void;
  handleShowLoopChange: () => void;
  handleNotationMenuChange: () => void;
  handlePianoChange: () => void;
}

interface IInnerProps extends IHandlerProps {
  suggestNotesChecked: boolean;
  setSuggestNotesChecked: (suggestNotes: boolean) => void;
}

const enhance = compose<IInnerProps, {}>(
  withRouter,
  connect(
    (state: Store.IState) => {
      const sessionUserId = state.session.id;
      const notationTranscriberUserId = get(state.notation.transcriber, 'id');

      return {
        isCurrentUserTranscriber: typeof sessionUserId === 'number' && sessionUserId === notationTranscriberUserId,
        isFretboardVisible: state.ui.isFretboardVisible,
        isLoopVisible: state.ui.isLoopVisible,
        isNotationMenuVisible: state.ui.isNotationMenuVisible,
        isPianoVisible: state.ui.isPianoVisible,
        role: state.session.role
      }
    },
    (dispatch: Dispatch) => ({
      setFretboardVisibility: (visibility: boolean) => dispatch(UiActions.setFretboardVisibility(visibility)),
      setLoopVisibility: (visibility: boolean) => dispatch(UiActions.setLoopVisibility(visibility)),
      setNotationMenuVisibility: (visibility: boolean) => dispatch(UiActions.setNotationMenuVisibility(visibility)),
      setPianoVisibility: (visibility: boolean) => dispatch(UiActions.setPianoVisibility(visibility))
    })
  ),
  withHandlers({
    handleFretboardChange: (props: IConnectProps) => () => {
      props.setFretboardVisibility(!props.isFretboardVisible);
    },
    handleNotationMenuChange: (props: IConnectProps) => () => {
      props.setNotationMenuVisibility(!props.isNotationMenuVisible);
    },
    handlePianoChange: (props: IConnectProps) => () => {
      props.setPianoVisibility(!props.isPianoVisible);
    },
    handleShowLoopChange: (props: IConnectProps) => () => {
      props.setLoopVisibility(!props.isLoopVisible);
    }
  }),
  withState('suggestNotesChecked', 'setSuggestNotesChecked', false),
);

interface IOuterDivProps {
  collapsed: boolean;
}

const Outer = styled('div') <IOuterDivProps>`
  position: fixed;
  max-width: ${props => props.collapsed ? '0' : '350px'};
  width: 75%;
  background: white;
  top: 0;
  right: 0;
  overflow-y: auto;
`;

const Inner = styled('div')`
  min-height: 100vh;
  height: 100vh;
`;

const CheckDescription = styled('span')`
  margin-left: 10px;
`;

interface IMaskProps {
  collapsed: boolean;
}

const Mask = styled('div')<IMaskProps>`
  background: black;
  opacity: 0.65;
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  height: 100vh;
  display: ${props => props.collapsed ? 'none' : 'block'};
`;

export const Menu = enhance(props => (
  <div>
    <Mask
      collapsed={!props.isNotationMenuVisible} 
      onClick={props.handleNotationMenuChange}
    />
    <Outer collapsed={!props.isNotationMenuVisible}>
      <Inner>
        <AntdMenu
          selectable={false}
          defaultSelectedKeys={[]}
          defaultOpenKeys={[]}
          mode="inline"
          inlineCollapsed={!props.isNotationMenuVisible}
        >
          <ItemGroup title="notation">
            <Item key="print">
              <Link to={`/n/${props.match.params.id}/print`}>
                <Icon type="printer" />
                <span>print</span>
              </Link>
            </Item>
            {
              props.isCurrentUserTranscriber || props.role === 'admin'
                ? <Item key="edit">
                  <Link to={`/n/${props.match.params.id}/edit`}>
                    <Icon type="edit" />
                    <span>edit</span>
                  </Link>
                </Item>
                : null
            }
            {
              props.role === 'admin'
                ? <Item key="studio">
                  <Link to={`/n/${props.match.params.id}/studio`}>
                    <Icon type="video-camera" />
                    <span>studio</span>
                  </Link>
                </Item>
                : null
            }
          </ItemGroup>
          <ItemGroup title="visuals">
            <Item key="fretboard">
              <Checkbox
                checked={props.isFretboardVisible}
                onChange={props.handleFretboardChange}
              >
                <CheckDescription>fretboard</CheckDescription>
              </Checkbox>
            </Item>
            <Item key="piano">
              <Checkbox
                checked={props.isPianoVisible}
                onChange={props.handlePianoChange}
              >
                <CheckDescription>piano</CheckDescription>
              </Checkbox>
            </Item>
          </ItemGroup>
          <ItemGroup title="player">
            <Item key="suggestNotes">
              <Checkbox checked={props.suggestNotesChecked}>
                <CheckDescription>suggest notes</CheckDescription>
              </Checkbox>
            </Item>
            <Item key="showLoop">
              <Checkbox
                checked={props.isLoopVisible}
                onChange={props.handleShowLoopChange}
              >
                <CheckDescription>show loop</CheckDescription>
              </Checkbox>
            </Item>
          </ItemGroup>
        </AntdMenu>
      </Inner>
    </Outer>
  </div>
));
