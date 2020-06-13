import React from 'react';
import styled from 'styled-components';

const Outer = styled.span`
  font-weight: lighter;
  letter-spacing: 1px;
  color: ${(props) => props.theme['@primary-color']};
`;

export const Wordmark: React.FC = () => <Outer>stringsync</Outer>;
