import React from 'react';
import styled from 'styled-components';

const StyledSpan = styled.span`
  font-weight: lighter;
  letter-spacing: 1px;
  color: ${(props) => props.theme['@primary-color']};
`;

export const Wordmark: React.FC = (props) => {
  return <StyledSpan>StringSync</StyledSpan>;
};
