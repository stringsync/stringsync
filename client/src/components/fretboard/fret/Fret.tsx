import * as React from 'react';

interface IProps {
  fret: number;
  width: number;
  dots: number;
}

export const Fret: React.SFC<IProps> = () => (
  <div>Fret</div>
);
