import * as React from 'react';
import styled from 'react-emotion';

const LogoText = styled('span')`
  font-size: 14px;
`;

const Logo: React.SFC = props => (
  <LogoText className="main-title">
    STRING SYNC
  </LogoText>
);

export default Logo;
