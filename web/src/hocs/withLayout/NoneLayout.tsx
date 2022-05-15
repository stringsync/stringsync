import React, { PropsWithChildren } from 'react';

export const NoneLayout: React.FC<PropsWithChildren<{}>> = (props) => {
  return <div data-testid="none-layout">{props.children}</div>;
};
