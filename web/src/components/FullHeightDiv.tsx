import React, { PropsWithChildren } from 'react';
import styled from 'styled-components';
import { useViewport } from '../ctx/viewport/useViewport';

const Outer = styled.div<{ $height: number }>`
  height: ${(props) => props.$height}px;
`;

type Props = PropsWithChildren<{}>;

export const FullHeightDiv = React.forwardRef<HTMLDivElement, Props>((props, ref) => {
  const { innerHeight } = useViewport();
  return (
    <Outer $height={innerHeight} ref={ref}>
      {props.children}
    </Outer>
  );
});
