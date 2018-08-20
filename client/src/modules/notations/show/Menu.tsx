import * as React from 'react';
import styled from 'react-emotion';
import { Menu as AntdMenu, Checkbox, Icon } from 'antd';
import { withRouter, Link, RouteComponentProps } from 'react-router-dom';
import { compose, withState, withHandlers } from 'recompose';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { connect, Dispatch } from 'react-redux';
import { get } from 'lodash';
import { UiActions } from 'data';

const { ItemGroup, Item } = AntdMenu;

interface IOuterProps {
  collapsed: boolean;
  fretboardVisibility: boolean;
  pianoVisibility: boolean;
  onFretboardVisibilityChange: (event: CheckboxChangeEvent) => void;
  onPianoVisibilityChange: (event: CheckboxChangeEvent) => void;
}

type WithRouterProps = IOuterProps & RouteComponentProps<{ id: string }, {}>

interface IConnectProps extends WithRouterProps {
  isCurrentUserTranscriber: boolean;
  role: Role.Roles;
  isLoopVisible: boolean;
  setLoopVisibility: (loopVisibility: boolean) => void;
}

interface IHandlerProps extends IConnectProps {
  handleShowLoopClick: (event: CheckboxChangeEvent) => void;
}

interface IInnerProps extends IHandlerProps {
  suggestNotesChecked: boolean;
  setSuggestNotesChecked: (suggestNotes: boolean) => void;
}

const enhance = compose<IInnerProps, IOuterProps>(
  withRouter,
  connect(
    (state: Store.IState) => {
      const sessionUserId = state.session.id;
      const notationTranscriberUserId = get(state.notation.transcriber, 'id');

      return {
        isCurrentUserTranscriber: typeof sessionUserId === 'number' && sessionUserId === notationTranscriberUserId,
        isLoopVisible: state.ui.isLoopVisible,
        role: state.session.role
      }
    },
    (dispatch: Dispatch) => ({
      setLoopVisibility: (loopVisibility: boolean) => dispatch(UiActions.setLoopVisibility(loopVisibility))
    })
  ),
  withHandlers({
    handleShowLoopClick: (props: IConnectProps) => () => {
      props.setLoopVisibility(!props.isLoopVisible);
    }
  }),
  withState('suggestNotesChecked', 'setSuggestNotesChecked', false),
);

interface IOuterDivProps {
  collapsed: boolean;
}

const Outer = styled('div')<IOuterDivProps>`
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

export const Menu = enhance(props => (
  <Outer collapsed={props.collapsed}>
    <Inner>
      <AntdMenu
        selectable={false}
        defaultSelectedKeys={[]}
        defaultOpenKeys={[]}
        mode="inline"
        inlineCollapsed={props.collapsed}
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
              checked={props.fretboardVisibility}
              onChange={props.onFretboardVisibilityChange}
            >
              <CheckDescription>fretboard</CheckDescription>
            </Checkbox>
          </Item>
          <Item key="piano">
            <Checkbox
              checked={props.pianoVisibility}
              onChange={props.onPianoVisibilityChange}
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
              onChange={props.handleShowLoopClick}
            >
              <CheckDescription>show loop</CheckDescription>
            </Checkbox>
          </Item>
        </ItemGroup>
      </AntdMenu>
    </Inner>
  </Outer>
));
