import React from 'react';
import styled from 'react-emotion';
import { Button, Icon } from 'antd';
import GoogleIconSrc from 'assets/google-logo-icon-36x36.png';

const GoogleButton = styled(Button) `
  background: white;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
`;

const GoogleLogo = styled('img') `
  width: 14px;
  margin-right: 4px;
`;

const FacebookButton = styled(Button) `
  color: white;
  width: 100%;
  background: #3f5692;
`;

const ProviderButtons = props => (
  <div>
    <GoogleButton>
      <GoogleLogo src={GoogleIconSrc} alt="google-icon" />
      Google
    </GoogleButton>
    <FacebookButton>
      <Icon type="facebook" />
      Facebook
    </FacebookButton>
  </div>
);

export default ProviderButtons;
