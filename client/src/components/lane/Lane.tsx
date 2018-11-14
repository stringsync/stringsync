import * as React from 'react';
import styled from 'react-emotion';

interface IProps {
  withTopMargin?: boolean;
  withPadding?: boolean;
}

const Outer = styled('div')<IProps>`
  width: 100%;
  ${props => props.withPadding ? 'padding: 0 50px;' : ''}
  ${props => props.withTopMargin ? 'margin-top: 48px;' : '' }
`;

const Inner = styled('div')`
  max-width: 1200px;
  margin: 0 auto;
`;

export const Lane: React.SFC<IProps> = props => (
  <Outer
    withPadding={props.withPadding}
    withTopMargin={props.withTopMargin}
  >
    <Inner>
      {props.children}
    </Inner>
  </Outer>
);
