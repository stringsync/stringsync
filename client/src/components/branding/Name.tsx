import * as React from 'react';
import styled from 'react-emotion';

const Text = styled('span')`
  letter-spacing: 1px;
  font-weight: lighter;
  color: ${props => props.theme['@primary-color']};
`;

export const Name = () => <Text>StringSync</Text>;
