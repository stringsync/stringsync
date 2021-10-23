import styled from 'styled-components';
import { FretboardJs, FretboardJsChildComponents, FretboardJsProps } from '../FretboardJs';

const Outer = styled.div`
  z-index: 3;
`;

type Props = FretboardJsProps & {};

export const Fretboard: React.FC<Props> & FretboardJsChildComponents = (props) => {
  return (
    <Outer>
      <FretboardJs>{props.children}</FretboardJs>
    </Outer>
  );
};

Fretboard.Position = FretboardJs.Position;
Fretboard.Scale = FretboardJs.Scale;
