import React from 'react';
import { compose } from 'recompose';
import styled from 'react-emotion';

const enhance = compose(

);

const Outer = styled('div')`
  background: black;
  opacity: 0.85;
  color: white;
`;

const NotationShowMenu = enhance(() => (
  <Outer>
    NotationShowMenu
  </Outer>
));

export default NotationShowMenu;
