import React from 'react';
import styled from 'react-emotion';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import logoSrc from 'assets/logo.svg';


const enhance = compose(
  connect(
    state => ({
      viewportType: state.viewport.type
    })
  )
);

const Outer = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Logo = styled('img')`
  width: 24px;
`;

const LogoText = styled('span')`
  margin-left: 8px;
  padding-left: 8px;
  font-size: 14px;
  height: 24px;
  border-left: 1px solid ${props => props.theme.primaryColor};
`;

/**
 * This component is the logo specifically for the nav component
 */
const NavLogo = enhance(props =>
  <Outer>
    <div>
      <Logo src={logoSrc} alt="logo" />
    </div>
    <div>
      {
        props.viewportType === 'DESKTOP' || props.viewportType === 'TABLET'
          ? <LogoText className="main-title">
              StringSync
            </LogoText>
          : null
      }
    </div>
  </Outer>
);

export default NavLogo;
