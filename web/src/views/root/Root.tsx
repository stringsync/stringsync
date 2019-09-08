import React from 'react';

interface Props {}

const Root: React.FC<Props> = (props) => {
  return <>{props.children}</>;
};

export default Root;
