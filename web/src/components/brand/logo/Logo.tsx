import React from 'react';
import logo from './logo.svg';

interface Props {
  size: string | number;
}

const Logo: React.FC<Props> = (props) => {
  return <img src={logo} alt="logo" width={props.size} height={props.size} />;
};

export default Logo;
