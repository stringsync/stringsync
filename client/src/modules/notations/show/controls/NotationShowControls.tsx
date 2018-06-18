import * as React from 'react';

interface IProps {
  menuCollapsed: boolean;
  onMenuClick: (event: React.SyntheticEvent<HTMLElement>) => void;
}

export const NotationShowControls: React.SFC<IProps> = () => (
  <div>
    NotationShowControls
  </div>
);
