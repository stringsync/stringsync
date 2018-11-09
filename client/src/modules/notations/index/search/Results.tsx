import * as React from 'react';

interface IProps {
  queryString: string;
  queryTags: string[];
  numQueried: number;
  onClear: () => void;
}

export const Results: React.SFC<IProps> = () => <div>results</div>;
