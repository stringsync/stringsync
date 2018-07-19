import * as React from 'react';
import styled from 'react-emotion';
import { Menu, Checkbox, Icon } from 'antd';
import { withRouter, Link, RouteComponentProps } from 'react-router-dom';
import { compose, withState } from 'recompose';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';

const { ItemGroup, Item } = Menu;

interface IOuterProps {
  collapsed: boolean;
  fretboardVisibility: boolean;
  pianoVisibility: boolean;
  onFretboardVisibilityChange: (event: CheckboxChangeEvent) => void;
  onPianoVisibilityChange: (event: CheckboxChangeEvent) => void;
}

type IWithRouterProps = IOuterProps & RouteComponentProps<{ id: string }, {}>

interface IInnerProps extends IWithRouterProps {
  suggestNotesChecked: boolean;
  showLoopChecked: boolean;
  setSuggestNotesChecked: (suggestNotes: boolean) => void;
  setShowLoopChecked: (showLoop: boolean) => void;
}

const enhance = compose<IInnerProps, IOuterProps>(
  withRouter,
  withState('suggestNotesChecked', 'setSuggestNotesChecked', false),
  withState('showLoopChecked', 'setShowLoopChecked', false)
);

interface IOuterDivProps {
  collapsed: boolean;
}

const Outer = styled('div')<IOuterDivProps>`
  position: fixed;
  max-width: ${props => props.collapsed ? '0' : '350px'};
  width: 100%;
  min-height: 100vh;
  background: white;
  top: 0;
  right: 0;
`;

const CheckDescription = styled('span')`
  margin-left: 10px;
`;

export const NotationShowMenu = enhance(props => (
  <Outer collapsed={props.collapsed}>
    <Menu
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
        <Item key="edit">
          <Link to={`/n/${props.match.params.id}/edit`}>
            <Icon type="edit" />
            <span>edit</span>
          </Link>
        </Item>
        <Item key="show">
          <Link to={`/n/${props.match.params.id}`}>
            <Icon type="picture" />
            <span>show</span>
          </Link>
        </Item>
        <Item key="studio">
          <Link to={`/n/${props.match.params.id}/studio`}>
            <Icon type="video-camera" />
            <span>studio</span>
          </Link>
        </Item>
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
          <Checkbox checked={props.suggestNotesChecked} />
          <CheckDescription>suggest notes</CheckDescription>
        </Item>
        <Item key="showLoop">
          <Checkbox checked={props.showLoopChecked} />
          <CheckDescription>show loop</CheckDescription>
        </Item>
      </ItemGroup>
    </Menu>
  </Outer>
));
