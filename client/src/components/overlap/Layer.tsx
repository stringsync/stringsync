import styled from 'react-emotion';

export const Layer = styled('div') <{ zIndex?: number }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: ${props => props.zIndex || 'inherit'};
`;
