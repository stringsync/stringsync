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
  font-size: 14px;
`;

/**
 * This component is the logo specifically for the nav component
 */
const Logo = enhance(props => <LogoText className="main-title">{props.logoText}</LogoText>);

export default Logo;
