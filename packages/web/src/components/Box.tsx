import styled from 'styled-components';

export const Box = styled.div`
  background: white;
  border: 1px solid ${(props) => props.theme['@border-color']};
  border-radius: 4px;
  padding: 24px;
`;
