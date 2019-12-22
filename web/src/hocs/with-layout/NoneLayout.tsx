import React from 'react';

export interface NoneLayoutProps {}

export const NoneLayout: React.FC<NoneLayoutProps> = (props) => (
  <div data-testid="none-layout">{props.children}</div>
);
