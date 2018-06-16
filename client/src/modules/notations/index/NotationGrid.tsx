import * as React from 'react';

interface IProps {
  notations: Notation.INotation[];
  queryTags: Set<string>;
}

export const NotationGrid: React.SFC<IProps> = () => (
  <div>
    NotationGrid
  </div>
);