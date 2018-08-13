import * as React from 'react';
import { compose } from 'recompose';
import { Icon } from 'antd';
import styled from 'react-emotion';

const enhance = compose<{}, {}>(

);

const Outer = styled('span')`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 24px;
`;

const StyledIcon = styled(Icon)`
  &:active {
    font-size: 20px;
  }

  transition: font-size 40ms ease-in;
`;

export const ShowLoop = enhance(props => (
  <Outer>
    <StyledIcon type="retweet" />
  </Outer>
));
