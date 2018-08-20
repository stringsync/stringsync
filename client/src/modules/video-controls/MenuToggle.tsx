import * as React from 'react';
import { Icon } from 'antd';
import styled from 'react-emotion';

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

export const MenuToggle: React.SFC = props => (
  <Outer menuCollapsed={false}>
    <Icon type="setting" />
  </Outer>
);
