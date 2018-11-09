import * as React from 'react';
import styled from 'react-emotion';

interface IProps {
  withTopMargin?: boolean;
}

interface IOuterProps {
  withTopMargin: boolean;
}

const Outer = styled('div')<IOuterProps>`
  padding: 0 50px;
  width: 100%;
  ${props => props.withTopMargin ? 'margin-top: 48px' : '' };
`;

const Inner = styled('div')`
  max-width: 1200px;
  margin: 0 auto;
`;

export const ContentLane: React.SFC<IProps> = props => (
  <Outer withTopMargin={!!props.withTopMargin}>
    <Inner>
      {props.children}
    </Inner>
  </Outer>
);
