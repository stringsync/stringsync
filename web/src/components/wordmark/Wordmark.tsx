import React from 'react';
import styled from 'styled-components';

const StyledSpan = styled.span`
  font-weight: lighter;
  letter-spacing: 1px;
  color: ${(props) => props.theme['@primary-color']};
`;

interface Props {}

export const Wordmark: React.FC<Props> = (props) => {
  return <StyledSpan>StringSync</StyledSpan>;
};
