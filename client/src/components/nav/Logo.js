import React from 'react';
import styled from 'react-emotion';
import { connect } from 'react-redux';
import { compose } from 'recompose';

const enhance = compose(
  connect(
    state => ({
      viewportType: state.viewport.type
    })
  )
);

const LogoText = styled('span')`
  font-size: 12px;
  font-weight: 100;
  letter-spacing: 3px;
  color: #aaa;

  &:hover {
    color: lime;
  }
`;

const LogoImage = styled('span')`

`;

/**
 * This component is the logo specifically for the nav component
 */
const Logo = enhance(() => (
  <span>
    <LogoText>
      STRING SYNC
    </LogoText>
    <LogoImage>
    
    </LogoImage>
  </span>
));

export default Logo;
