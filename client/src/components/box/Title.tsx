import * as React from 'react';
import { branch, compose, renderNothing } from 'recompose';
import styled from 'react-emotion';

interface IProps {
  title?: string;
}

const enhance = compose<IProps, IProps>(
  branch<IProps>(props => !props.title, renderNothing)
);

const Header = styled('h2')`
  font-size: 24px;
  font-weight: lighter;
  text-align: center;
  letter-spacing: 3px;
`;

export const Title = enhance(props => <Header>{props.title}</Header>);
