import React from 'react';
import styled from 'react-emotion';
import { connect } from 'react-redux';
import { compose, mapProps } from 'recompose';

const enhance = compose(
  connect(
    state => ({
      viewportType: state.viewport.type
    })
  ),
  mapProps(props => {
    const logoText = props.viewportType === 'DESKTOP' || props.viewportType === 'TABLET'
      ? 'STRING SYNC'
      : 'SS'

    return {
      logoText
    }
  })
);

const LogoText = styled('span')`
  font-size: 12px;
  font-weight: 100;
  letter-spacing: 3px;
`;

/**
 * This component is the logo specifically for the nav component
 */
const Logo = enhance(props => <LogoText>{props.logoText}</LogoText>);

export default Logo;
