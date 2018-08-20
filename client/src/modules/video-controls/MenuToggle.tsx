import * as React from 'react';
import { Icon } from 'antd';
import styled from 'react-emotion';
import { compose } from 'recompose';
import { connect } from 'react-redux';

interface IInnerProps {
  isNotationMenuVisible: boolean;
}

const enhance = compose<IInnerProps, {}>(
  connect(
    (state: Store.IState) => ({
      isNotationMenuVisible: state.ui.isNotationMenuVisible
    })
  )
);

interface IOuterSpanProps {
  menuCollapsed: boolean;
}

/**
 * Workaround since applying the styles to the Icon component causes errors
 */
const Outer = styled('span')<IOuterSpanProps>`
  i {
    transform: ${props => props.menuCollapsed ? 'rotate(0deg)' : 'rotate(180deg)'};
    transition: transform .2s ease-in;
  }
`;

export const MenuToggle = enhance(props => (
  <Outer menuCollapsed={props.isNotationMenuVisible}>
    <Icon type="setting" />
  </Outer>
));
