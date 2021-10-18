import styled from 'styled-components';

export const CONTROLS_HEIGHT_PX = 72;

const Outer = styled.div`
  border: 1px solid lime;
  height: ${CONTROLS_HEIGHT_PX}px;
`;

export const Controls = () => {
  return <Outer>Controls</Outer>;
};
