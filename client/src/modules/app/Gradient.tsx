import styled from 'react-emotion';

const getGradientColors = (theme: any) => [
  theme['@primary-color'],
  theme['@secondary-color'],
  theme['@tertiary-color'],
];

export const Gradient = styled('div')`
  height: 2px;
  background: ${props => props.theme['@primary-color']};
  background: linear-gradient(to right, ${props => getGradientColors(props.theme).join(', ')});
`;
