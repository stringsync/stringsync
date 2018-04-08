import styled from 'react-emotion';

const Layer = styled('div')`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: ${props => props.zIndex || 'inherit'};
`;

export default Layer;
