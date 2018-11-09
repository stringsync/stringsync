import * as React from 'react';
import src from '../../assets/logo.svg';

interface IProps {
  size: string | number;
}

export const Logo: React.SFC<IProps> = props => (
  <img src={src} width={props.size} height={props.size} />
);
