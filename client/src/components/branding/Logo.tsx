import * as React from 'react';
import src from '../../assets/logo.svg';

interface IProps {
  width: string | number;
  height: string | number;
}

export const Logo: React.SFC<IProps> = props => (
  <img src={src} width={props.width} height={props.height} />
);
